// src/components/collector/CollectorDashboard.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Caminho para o useAuth

// ... o restante do seu código CollectorDashboard

// Dashboard simples para coletor
const CollectorDashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-500 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">EcoColeta SLZ</h1>
            <p className="text-green-100 text-sm">Bem-vindo, {user?.profile?.name}</p>
          </div>
          <button
            onClick={logout}
            className="bg-green-400 hover:bg-green-300 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Dashboard do Coletor</h2>
          <p className="text-gray-600">Sistema implementado com sucesso! Aqui você pode ver os pontos de coleta disponíveis.</p>
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard; 