// src/services/auth.jsx
import React, { useState, createContext, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase_config';
import api from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 // src/services/auth.jsx

  // MUDANÇA: O useEffect agora usa a rota GET /users com um filtro
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Passo 1: Montar o filtro para buscar onde o campo 'uid' é igual ao uid do Firebase
          const filter = { where: { uid: firebaseUser.uid } };
          const encodedFilter = encodeURIComponent(JSON.stringify(filter));

          // Passo 2: Chamar a rota /users com o parâmetro 'filter' na URL
          const response = await api.get(`/users?filter=${encodedFilter}`);
          
          // A rota /users sempre retorna um ARRAY. Se o usuário for encontrado, ele será o primeiro item.
          if (response.data && response.data.length > 0) {
            const profileData = response.data[0];

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email, 
              ...profileData,
            });
          } else {
            // Se o array estiver vazio, o perfil não foi encontrado no banco de dados
            throw new Error(`Perfil não encontrado para o UID: ${firebaseUser.uid}`);
          }

        } catch (error) {
          console.error("Não foi possível buscar dados do perfil. Fazendo logout.", error);
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
  // MUDANÇA: A função signup agora monta o objeto polimórfico
// src/services/auth.jsx

  const signup = async (formData) => {
    setLoading(true);
    let firebaseUserCredential;
    try {
      // Passo 1: Criar o utilizador no Firebase
      firebaseUserCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const firebaseUser = firebaseUserCredential.user;

      // Passo 2: Montar o objeto de perfil para o backend
      const profileData = {
        uid: firebaseUser.uid,
        email: formData.email,
        name: formData.name,
        phone: formData.phone, // Mantendo o formato original, como no seu teste curl
        userType: formData.userType,
        documentType: formData.userType === 'collector' ? 'CPF' : 'CNPJ',
        documentValue: formData.document.replace(/[^\d]/g, ''),
        status: 'active',
        // MUDANÇA CRÍTICA AQUI:
        // Garantimos que os campos 'address' e 'license' sempre existam no objeto,
        // mesmo que como uma string vazia, para corresponder ao que o backend espera.
        address: formData.address || '',
        license: formData.license || '',
      };
      
      // Passo 3: Enviar os dados para o endpoint de criação
      await api.post(`/users`, profileData);

      return { success: true };

    } catch (error) {
      if (firebaseUserCredential) {
        await firebaseUserCredential.user.delete();
      }
      
      console.error("Erro no cadastro:", error);
      const errorMessage = error.response?.data?.error?.message || 
                         (error.code === 'auth/email-already-in-use' 
                           ? 'Este email já está em uso.' 
                           : 'Falha ao criar a conta.');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

const login = async (email, password, formUserType) => {
    setLoading(true);
    try {
      // Passo 1: Buscar o usuário no seu banco de dados pelo email
      const filter = { where: { email } };
      const encodedFilter = encodeURIComponent(JSON.stringify(filter));
      const response = await api.get(`/users?filter=${encodedFilter}`);

      // Passo 2: Validar o perfil do usuário
      if (!response.data || response.data.length === 0) {
        // Usuário não encontrado no seu banco de dados
        return { success: false, error: 'Email ou senha inválidos.' };
      }

      const userProfile = response.data[0];

      // Verificar se o tipo de usuário do perfil bate com o tipo do formulário
      if (userProfile.userType !== formUserType) {
        const expectedType = userProfile.userType === 'collector' ? 'Coletor' : 'Estabelecimento';
        return { 
          success: false, 
          error: `Login inválido para este perfil. Tente o acesso pela área de ${expectedType}.` 
        };
      }
      
      // Opcional: Verificar se a conta está ativa
      if (userProfile.status !== 'active') {
        return { success: false, error: 'Esta conta está inativa ou bloqueada.' };
      }

      // Passo 3: Se as validações passaram, autenticar com o Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Sucesso! O onAuthStateChanged vai cuidar de atualizar o estado do usuário.
      return { success: true };

    } catch (error) {
      // Captura erros tanto da API quanto do Firebase
      console.error("Erro no processo de login:", error);
      
      // Retorna uma mensagem genérica para não informar se o email existe ou se a senha está errada
      return { success: false, error: 'Email ou senha inválidos.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
        await signOut(auth);
    } catch(error) {
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
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
