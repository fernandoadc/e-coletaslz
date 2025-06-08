// src/services/auth.jsx
import React, { useState, createContext, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase_config";
import api from "./api";
import DOMPurify from "dompurify";

const AuthContext = createContext();

const MAX_INPUT_LENGTH = 500;

export function validaCPF(cpf) {
  const cleanedCPF = cpf.replace(/[^\d]+/g, "");

  if (cleanedCPF === "" || cleanedCPF.length !== 11) return false;

  const invalidCPFs = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];

  if (invalidCPFs.includes(cleanedCPF)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanedCPF.charAt(i)) * (10 - i);
  }

  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cleanedCPF.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanedCPF.charAt(i)) * (11 - i);
  }

  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cleanedCPF.charAt(10))) return false;

  return true;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const filter = { where: { uid: firebaseUser.uid } };
          const encodedFilter = encodeURIComponent(JSON.stringify(filter));

          const response = await api.get(`/users?filter=${encodedFilter}`);

          if (response.data && response.data.length > 0) {
            const profileData = response.data[0];

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...profileData,
            });
          } else {
            throw new Error(`Perfil não encontrado.`);
          }
        } catch (error) {
          const errorLog = {
            timestamp: new Date().toISOString(),
            action: "profile_fetch_failed",
            uid: firebaseUser?.uid || "unknown",
          };
          console.error("Erro de autenticação:", errorLog);
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sanitizeInput = (input, maxLength = MAX_INPUT_LENGTH) => {
    if (typeof input !== "string") return input;

    if (input.length > maxLength) {
      throw new Error(
        `Entrada muito longa. Máximo de ${maxLength} caracteres permitido.`,
      );
    }

    const sanitized = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    }).trim();

    const dangerousPatterns = [
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
      /onclick=/i,
      /<script/i,
      /eval\(/i,
      /expression\(/i,
    ];

    if (dangerousPatterns.some((pattern) => pattern.test(sanitized))) {
      throw new Error("Entrada inválida.");
    }

    return sanitized;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  const validatePassword = (password) => {
    if (!password || password.length < 8) {
      throw new Error("Senha deve ter pelo menos 8 caracteres");
    }
    if (password.length > 128) {
      throw new Error("Senha muito longa.");
    }
    return true;
  };

  const signup = async (formData) => {
    setLoading(true);
    let firebaseUserCredential;
    try {
      if (!validateEmail(formData.email)) {
        throw new Error("Formato de email inválido.");
      }

      validatePassword(formData.password);

      firebaseUserCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const firebaseUser = firebaseUserCredential.user;

      const sanitizedData = {
        email: sanitizeInput(formData.email, 254),
        name: sanitizeInput(formData.name, 100),
        phone: sanitizeInput(formData.phone, 20).replace(/[^\d]/g, ""),
        userType: sanitizeInput(formData.userType, 20),
        document: sanitizeInput(formData.document, 20).replace(/[^\d]/g, ""),
        address: formData.address ? sanitizeInput(formData.address, 200) : "",
        license: formData.license ? sanitizeInput(formData.license, 50) : "",
      };

      const profileData = {
        uid: firebaseUser.uid,
        email: sanitizedData.email,
        name: sanitizedData.name,
        phone: sanitizedData.phone,
        userType: sanitizedData.userType,
        documentType: sanitizedData.userType === "collector" ? "CPF" : "CNPJ",
        documentValue: sanitizedData.document,
        status: "active",
        address: sanitizedData.address,
        license: sanitizedData.license,
      };

      if (
        profileData.userType === "collector" &&
        !validaCPF(profileData.documentValue)
      ) {
        throw new Error("CPF inválido.");
      }
      if (
        profileData.userType === "establishment" &&
        profileData.documentValue.length !== 14
      ) {
        throw new Error("CNPJ inválido. Deve conter 14 dígitos.");
      }

      if (profileData.phone.length < 10 || profileData.phone.length > 11) {
        throw new Error("Número de telefone inválido.");
      }

      await api.post(`/users`, profileData);

      return { success: true };
    } catch (error) {
      if (firebaseUserCredential) {
        await firebaseUserCredential.user.delete();
      }

      // console.error("Erro no cadastro:", error);

      const errorLog = {
        timestamp: new Date().toISOString(),
        action: "signup_failed",
        errorType: error.code || "unknown",
      };
      console.error("Erro ao cadastrar-se:", errorLog);

      const getErrorMessage = (error) => {
        if (error.message.includes("CPF inválido")) return "CPF inválido";
        if (error.message.includes("CNPJ inválido")) return "CNPJ inválido";
        if (error.message.includes("Formato de email")) return "Email inválido";
        if (error.message.includes("Senha deve ter"))
          return "Senha deve ter pelo menos 8 caracteres";
        if (error.message.includes("Número de telefone inválido"))
          return "Número de telefone inválido";
        if (error.message.includes("Entrada muito longa"))
          return "Dados muito longos";
        if (error.message.includes("Entrada inválida"))
          return "Entrada inválida detectada";
        if (error.code === "auth/email-already-in-use")
          return "Este email já está em uso";
        if (error.code === "auth/weak-password") return "Senha muito fraca";
        if (error.code === "auth/invalid-email") return "Email inválido";

        return "Falha ao criar conta. Verifique os dados enviados.";
      };
      return { success: false, error: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, formUserType) => {
    setLoading(true);
    try {
      if (!validateEmail(email)) {
        throw new Error("Formato de email inválido.");
      }

      if (!password || password.length < 1) {
        throw new Error("Senha não pode ser vazia.");
      }

      const sanitizedEmail = sanitizeInput(email, 254);
      const sanitizedUserType = sanitizeInput(formUserType, 20);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      const filter = { where: { email } };
      const encodedFilter = encodeURIComponent(JSON.stringify(filter));
      const response = await api.get(`/users?filter=${encodedFilter}`);

      if (!response.data || response.data.length === 0) {
        await signOut(auth);
        return {
          success: false,
          error: "Conta não encontrada. Por favor, cadastre-se.",
        };
      }

      const userProfile = response.data[0];

      if (userProfile.userType !== formUserType) {
        await signOut(auth);
        const expectedType =
          userProfile.userType === "collector" ? "Coletor" : "Estabelecimento";
        return {
          success: false,
          error: `Cadastro incompatível.`,
        };
      }

      console.log("Login bem-sucedido!", {
        timestamp: new Date().toISOString(),
        uid: firebaseUser.uid,
        userType: userProfile.userType,
      });

      if (userProfile.status !== "active") {
        await signOut(auth);
        return {
          success: false,
          error: "Esta conta está inativa. Entre em contato com o suporte.",
        };
      }

      return { success: true };
    } catch (error) {
      const errorLog = {
        timestamp: new Date().toISOString(),
        action: "login_failed",
        errorCode: error.code || "unknown",
      };
      console.error("Erro de login:", errorLog);

      const getErrorMessage = (error) => {
        if (error.code === "auth/too-many-requests") {
          return "Muitas tentativas falhas. Acesso temporariamente bloqueado.";
        }
        if (error.code === "auth/user-not-found")
          return "Email não cadastrado.";
        if (error.code === "auth/wrong-password") return "Senha incorreta.";
        if (error.code === "auth/invalid-email") return "Email inválido.";
        if (error.code === "auth/user-disabled") return "Conta desabilitada.";
        if (error.message.includes("Formato de email inválido"))
          return "Formato de email inválido.";

        return "Email ou senha inválidos.";
      };

      return { success: false, error: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    signup,
    login,
    logout,
    loading,
  };

  const resetPassword = async (email) => {
    setLoading(true);
    try {
      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      const sanitizedEmail = sanitizeInput(email, 254);

      // Verificar se o email existe no sistema
      const filter = { where: { email: sanitizedEmail } };
      const encodedFilter = encodeURIComponent(JSON.stringify(filter));
      const response = await api.get(`/users?filter=${encodedFilter}`);

      if (!response.data || response.data.length === 0) {
        // Por segurança, não revelar se email existe ou não
        // Mas ainda enviar o email do Firebase (que não fará nada se não existir)
        console.log("Password reset attempted for non-existent email:", {
          timestamp: new Date().toISOString(),
          action: "password_reset_invalid_email",
        });
      }

      // Firebase envia email de redefinição automaticamente
      await sendPasswordResetEmail(auth, sanitizedEmail, {
        // Configurações opcionais do email
        url: `${window.location.origin}/login`, // Redirect após reset
        handleCodeInApp: false, // Email será processado pelo Firebase
      });

      console.log("Password reset email sent:", {
        timestamp: new Date().toISOString(),
        action: "password_reset_email_sent",
      });

      return {
        success: true,
        message:
          "Email de redefinição enviado! Verifique sua caixa de entrada.",
      };
    } catch (error) {
      const errorLog = {
        timestamp: new Date().toISOString(),
        action: "password_reset_failed",
        errorCode: error.code || "unknown",
      };
      console.error("Password reset error:", errorLog);

      const getErrorMessage = (error) => {
        if (error.code === "auth/user-not-found") {
          // Por segurança, mesma mensagem para email válido/inválido
          return "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha.";
        }
        if (error.code === "auth/invalid-email") {
          return "Email inválido.";
        }
        if (error.code === "auth/too-many-requests") {
          return "Muitas tentativas. Tente novamente mais tarde.";
        }
        if (error.message.includes("Invalid email format")) {
          return "Formato de email inválido.";
        }

        return "Erro ao enviar email de redefinição. Tente novamente.";
      };

      return { success: false, error: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
