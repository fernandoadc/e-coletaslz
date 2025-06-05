// src/App.js
import React, { useState } from 'react';
// Importa o hook useAuth e AuthProvider do seu arquivo de contexto
import { useAuth, AuthProvider } from './contexts/AuthContext'; // CORREÇÃO: Importa de AuthContext

// Importe seus componentes de suas novas localizações
// src/App.js
import UserTypeSelector from './components/auth/UserTypeSelector'; // Caminho certo para o default export
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import EstablishmentDashboard from './components/establishment/EstablishmentDashboard';
import CollectorDashboard from './components/collector/CollectorDashboard';

// Componente principal do App
const App = () => {
  const { user, loading } = useAuth();
  const [selectedUserType, setSelectedUserType] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'signup'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o usuário está logado, mostrar o dashboard apropriado
  if (user) {
    if (user.userType === 'establishment') {
      return <EstablishmentDashboard />;
    } else {
      return <CollectorDashboard />;
    }
  }

  // Se nenhum tipo de usuário foi selecionado, mostrar seletor
  if (!selectedUserType) {
    return <UserTypeSelector onSelectType={setSelectedUserType} />;
  }

  // Mostrar formulário de login ou cadastro baseado no modo atual
  if (authMode === 'login') {
    return (
      <LoginForm
        userType={selectedUserType}
        onBack={() => setSelectedUserType('')}
        onToggleForm={() => setAuthMode('signup')}
      />
    );
  } else {
    return (
      <SignupForm
        userType={selectedUserType}
        onBack={() => setSelectedUserType('')}
        onToggleForm={() => setAuthMode('login')}
      />
    );
  }
};

// Componente wrapper com o Provider
const AppWithAuth = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWithAuth;