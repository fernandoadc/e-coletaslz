// src/contexts/AuthContext.jsx
import React, { useState, createContext, useContext, useEffect } from 'react';

// Context para autenticação
const AuthContext = createContext();

// Provider de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ecocolta_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    setLoading(true);
    try {
      const userData = {
        id: Date.now().toString(),
        email,
        userType,
        profile: {
          name: userType === 'establishment' ? 'Padaria São Luís' : 'João Silva',
          phone: '(98) 3232-1234'
        },
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('ecocolta_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error("Erro no login simulado:", error);
      return { success: false, error: 'Erro ao fazer login' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const userData = {
        id: Date.now().toString(),
        email: formData.email,
        userType: formData.userType,
        profile: {
          name: formData.name,
          phone: formData.phone,
          ...(formData.userType === 'establishment' && { address: formData.address }),
          ...(formData.userType === 'collector' && { license: formData.license })
        },
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('ecocolta_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error("Erro no cadastro simulado:", error);
      return { success: false, error: 'Erro ao criar conta' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecocolta_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
