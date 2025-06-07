// src/services/auth.jsx
import React, { useState, createContext, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase_config";
import api from "./api";

const AuthContext = createContext();

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
            throw new Error(
              `Perfil não encontrado para o UID: ${firebaseUser.uid}`,
            );
          }
        } catch (error) {
          console.error(
            "Não foi possível buscar dados do perfil. Fazendo logout.",
            error,
          );
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

  const signup = async (formData) => {
    setLoading(true);
    let firebaseUserCredential;
    try {
      firebaseUserCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const firebaseUser = firebaseUserCredential.user;

      const profileData = {
        uid: firebaseUser.uid,
        email: formData.email,
        name: formData.name,
        phone: formData.phone.replace(/[^\d]/g, ""),
        userType: formData.userType,
        documentType: formData.userType === "collector" ? "CPF" : "CNPJ",
        documentValue: formData.document.replace(/[^\d]/g, ""),
        status: "active",
        address: formData.address || "",
        license: formData.license || "",
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

      await api.post(`/users`, profileData);

      return { success: true };
    } catch (error) {
      if (firebaseUserCredential) {
        await firebaseUserCredential.user.delete();
      }

      // console.error("Erro no cadastro:", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        (error.message.includes("CPF inválido")
          ? "O CPF informado é inválido."
          : null) ||
        (error.message.includes("CNPJ inválido")
          ? "O CNPJ informado é inválido."
          : null) ||
        (error.code === "auth/email-already-in-use"
          ? "Este email já está em uso."
          : "Falha ao criar a conta. Verifique os dados enviados.");
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, formUserType) => {
    setLoading(true);
    try {
      const filter = { where: { email } };
      const encodedFilter = encodeURIComponent(JSON.stringify(filter));
      const response = await api.get(`/users?filter=${encodedFilter}`);

      if (!response.data || response.data.length === 0) {
        return { success: false, error: "Email ou senha inválidos." };
      }

      const userProfile = response.data[0];

      if (userProfile.userType !== formUserType) {
        const expectedType =
          userProfile.userType === "collector" ? "Coletor" : "Estabelecimento";
        return {
          success: false,
          error: `Login inválido para este perfil. Tente o acesso pela área de ${expectedType}.`,
        };
      }

      if (userProfile.status !== "active") {
        return {
          success: false,
          error: "Esta conta está inativa ou bloqueada.",
        };
      }

      await signInWithEmailAndPassword(auth, email, password);

      return { success: true };
    } catch (error) {
      console.error("Erro no processo de login:", error);

      return { success: false, error: "Email ou senha inválidos." };
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
