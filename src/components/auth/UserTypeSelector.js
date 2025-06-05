import React from 'react';
import { Trash2, Users, Building } from 'lucide-react'; // 
// Componente de seleção de tipo de usuário
const UserTypeSelector = ({ onSelectType }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">EcoColeta SLZ</h1>
          <p className="text-gray-600">Coleta inteligente de recicláveis em São Luís</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelectType('establishment')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Building className="w-6 h-6" />
            Sou Estabelecimento
          </button>
          
          <button
            onClick={() => onSelectType('collector')}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Users className="w-6 h-6" />
            Sou Coletor
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector;