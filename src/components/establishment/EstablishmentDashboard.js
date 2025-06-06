import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, AlertCircle, CheckCircle, Clock, Trash2, Bell } from 'lucide-react';

// Simulação do useAuth (já que não temos acesso ao contexto real)
//const useAuth = () => ({
 // user: {
   // profile: {
     // name: 'Padaria São Luís'
    //}
  //},
  //logout: () => console.log('Logout simulado')
//});

const EstablishmentDashboard = () => {
  const { user, logout } = useAuth();
  
  // Estados para gerenciar os recipientes
  const [containers, setContainers] = useState([
    {
      id: 1,
      type: 'Vidro',
      location: 'Entrada Principal',
      status: 'empty', // empty, half, full, collected
      lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      capacity: 100,
      currentLevel: 15
    },
    {
      id: 2,
      type: 'Vidro',
      location: 'Área dos Fundos',
      status: 'half',
      lastUpdate: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
      capacity: 100,
      currentLevel: 65
    }
  ]);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Função para marcar recipiente como cheio
  const markAsFull = (containerId) => {
    setContainers(prev => 
      prev.map(container => 
        container.id === containerId 
          ? { 
              ...container, 
              status: 'full', 
              currentLevel: 100,
              lastUpdate: new Date() 
            }
          : container
      )
    );
    
    // Adicionar notificação
    const container = containers.find(c => c.id === containerId);
    const newNotification = {
      id: Date.now(),
      message: `Recipiente de ${container.type} em ${container.location} marcado como cheio`,
      time: new Date(),
      type: 'success'
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Manter apenas 5 notificações
    
    // Simular envio de alerta para coletores
    setTimeout(() => {
      const alertNotification = {
        id: Date.now() + 1,
        message: `Alerta enviado para coletores - Recipiente ${container.location}`,
        time: new Date(),
        type: 'info'
      };
      setNotifications(prev => [alertNotification, ...prev.slice(0, 4)]);
    }, 2000);
  };

  // Função para simular coleta realizada
  const markAsCollected = (containerId) => {
    setContainers(prev => 
      prev.map(container => 
        container.id === containerId 
          ? { 
              ...container, 
              status: 'empty', 
              currentLevel: 0,
              lastUpdate: new Date() 
            }
          : container
      )
    );
    
    const container = containers.find(c => c.id === containerId);
    const newNotification = {
      id: Date.now(),
      message: `Recipiente de ${container.type} em ${container.location} foi coletado`,
      time: new Date(),
      type: 'success'
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'empty': return 'text-green-600 bg-green-100';
      case 'half': return 'text-yellow-600 bg-yellow-100';
      case 'full': return 'text-red-600 bg-red-100';
      case 'collected': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Função para obter texto do status
  const getStatusText = (status) => {
    switch (status) {
      case 'empty': return 'Vazio';
      case 'half': return 'Parcialmente Cheio';
      case 'full': return 'Cheio - Aguardando Coleta';
      case 'collected': return 'Coletado';
      default: return 'Desconhecido';
    }
  };

  // Função para obter ícone do status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'empty': return <CheckCircle className="w-5 h-5" />;
      case 'half': return <Clock className="w-5 h-5" />;
      case 'full': return <AlertCircle className="w-5 h-5" />;
      case 'collected': return <CheckCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  // Calcular estatísticas
  const stats = {
    total: containers.length,
    full: containers.filter(c => c.status === 'full').length,
    empty: containers.filter(c => c.status === 'empty').length,
    pendingCollection: containers.filter(c => c.status === 'full').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">EcoColeta SLZ</h1>
            <p className="text-green-100 text-sm">Bem-vindo, {user?.profile?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Botão de Notificações */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-green-400 hover:bg-green-300 p-2 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>
              
              {/* Dropdown de Notificações */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-800">Notificações</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500 text-center">
                        Nenhuma notificação
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div key={notification.id} className="p-3 border-b hover:bg-gray-50">
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time.toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={logout}
              className="bg-green-400 hover:bg-green-300 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Recipientes</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <Trash2 className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recipientes Cheios</p>
                <p className="text-2xl font-bold text-red-600">{stats.full}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recipientes Vazios</p>
                <p className="text-2xl font-bold text-green-600">{stats.empty}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aguardando Coleta</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingCollection}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Lista de Recipientes */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Seus Recipientes de Coleta</h2>
            <p className="text-sm text-gray-600 mt-1">Gerencie o status dos seus recipientes de vidro</p>
          </div>
          
          <div className="p-6 space-y-4">
            {containers.map(container => (
              <div key={container.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-green-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-800">{container.type}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{container.location}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Última atualização: {container.lastUpdate.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Barra de Nível */}
                    <div className="w-24">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Nível</span>
                        <span>{container.currentLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            container.currentLevel >= 90 ? 'bg-red-500' :
                            container.currentLevel >= 60 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${container.currentLevel}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(container.status)}`}>
                      {getStatusIcon(container.status)}
                      {getStatusText(container.status)}
                    </div>
                    
                    {/* Botões de Ação */}
                    <div className="flex gap-2">
                      {container.status !== 'full' && (
                        <button
                          onClick={() => markAsFull(container.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          Marcar como Cheio
                        </button>
                      )}
                      
                      {container.status === 'full' && (
                        <button
                          onClick={() => markAsCollected(container.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          Marcar como Coletado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Como funciona o sistema
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Quando um recipiente estiver cheio, clique em "Marcar como Cheio"</li>
                  <li>O sistema enviará automaticamente um alerta para os coletores</li>
                  <li>Os coletores verão a localização no mapa e virão fazer a coleta</li>
                  <li>Após a coleta, marque como "Coletado" para resetar o recipiente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentDashboard;