import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Dashboard simples para estabelecimento
const EstablishmentDashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-500 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">EcoColeta SLZ</h1>
            <p className="text-blue-100 text-sm">Bem-vindo, {user?.profile?.name}</p>
          </div>
          <button
            onClick={logout}
            className="bg-blue-400 hover:bg-blue-300 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Dashboard do Estabelecimento</h2>
          <p className="text-gray-600">Sistema implementado com sucesso! Aqui você pode gerenciar seus containers de coleta.</p>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentDashboard; 