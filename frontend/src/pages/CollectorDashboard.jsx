
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import { MapPin, Navigation, Clock, CheckCircle, AlertCircle, Truck, Route, Bell, Filter } from 'lucide-react';

function CollectorDashboard() {
  const { user, logout } = useAuth();
  
  // Estados para gerenciar coletas e mapa
  const [collectionPoints, setCollectionPoints] = useState([
    {
      id: 1,
      establishmentName: 'Padaria São Luís',
      address: 'Rua Grande, 123 - Centro',
      coordinates: { lat: -2.5387, lng: -44.2825 },
      distance: '2.3 km',
      estimatedTime: '8 min',
      containerType: 'Vidro',
      status: 'ready', // ready, in_progress, completed
      alertTime: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
      priority: 'high', // high, medium, low
      estimatedWeight: '25 kg'
    },
    {
      id: 2,
      establishmentName: 'Restaurante Tempero Maranhense',
      address: 'Av. Litorânea, 456 - Ponta da Areia',
      coordinates: { lat: -2.4968, lng: -44.3038 },
      distance: '5.7 km',
      estimatedTime: '15 min',
      containerType: 'Vidro',
      status: 'ready',
      alertTime: new Date(Date.now() - 45 * 60 * 1000), // 45 min atrás
      priority: 'medium',
      estimatedWeight: '18 kg'
    },
    {
      id: 3,
      establishmentName: 'Bar do Caju',
      address: 'Rua do Sol, 789 - São Francisco',
      coordinates: { lat: -2.5297, lng: -44.3067 },
      distance: '3.1 km',
      estimatedTime: '12 min',
      containerType: 'Vidro',
      status: 'ready',
      alertTime: new Date(Date.now() - 15 * 60 * 1000), // 15 min atrás
      priority: 'high',
      estimatedWeight: '30 kg'
    }
  ]);

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [filter, setFilter] = useState('all'); // all, high, medium, low
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'Novo ponto de coleta disponível - Padaria São Luís',
      time: new Date(Date.now() - 30 * 60 * 1000),
      read: false
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [activeCollections, setActiveCollections] = useState([]);

  // Função para iniciar coleta
  const startCollection = (pointId) => {
    setCollectionPoints(prev => 
      prev.map(point => 
        point.id === pointId 
          ? { ...point, status: 'in_progress' }
          : point
      )
    );
    setActiveCollections(prev => [...prev, pointId]);
    
    // Simular início da rota
    const point = collectionPoints.find(p => p.id === pointId);
    setCurrentRoute({
      destination: point.establishmentName,
      address: point.address,
      estimatedTime: point.estimatedTime,
      distance: point.distance
    });
  };

  // Função para concluir coleta
  const completeCollection = (pointId) => {
    setCollectionPoints(prev => 
      prev.map(point => 
        point.id === pointId 
          ? { ...point, status: 'completed' }
          : point
      )
    );
    setActiveCollections(prev => prev.filter(id => id !== pointId));
    setCurrentRoute(null);
    
    // Adicionar notificação de sucesso
    const point = collectionPoints.find(p => p.id === pointId);
    const newNotification = {
      id: Date.now(),
      message: `Coleta concluída - ${point.establishmentName}`,
      time: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  // Função para abrir navegação (simulada)
  const openNavigation = (point) => {
    alert(`Abrindo navegação para:\n${point.establishmentName}\n${point.address}\n\nTempo estimado: ${point.estimatedTime}`);
  };

  // Função para obter cor da prioridade
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Função para obter texto da prioridade
  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  // Filtrar pontos por prioridade
  const filteredPoints = collectionPoints.filter(point => {
    if (filter === 'all' || point.status !== 'ready') return true;
    return point.priority === filter;
  });

  // Calcular estatísticas
  const stats = {
    available: collectionPoints.filter(p => p.status === 'ready').length,
    inProgress: collectionPoints.filter(p => p.status === 'in_progress').length,
    completedToday: collectionPoints.filter(p => p.status === 'completed').length,
    totalWeight: collectionPoints.filter(p => p.status === 'completed').reduce((acc, point) => acc + parseInt(point.estimatedWeight), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">EcoColeta SLZ</h1>
            <p className="text-blue-100 text-sm">Bem-vindo, {user?.profile?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Botão de Notificações */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-blue-400 hover:bg-blue-300 p-2 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
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
                        <div key={notification.id} className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
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
              type="button"
              onClick={logout}
              className="bg-blue-400 hover:bg-blue-300 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Cards de Estatísticas */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pontos Disponíveis</p>
                <p className="text-2xl font-bold text-blue-600">{stats.available}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <Truck className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas Hoje</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Peso Coletado (Hoje)</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalWeight} kg</p>
              </div>
              <AlertCircle className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </section>

        {/* Rota Atual */}
        {currentRoute && (
          <section className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex items-center gap-3">
              <Route className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">Rota Ativa</h3>
                <p className="text-blue-700">
                  {currentRoute.destination} • {currentRoute.distance} • {currentRoute.estimatedTime}
                </p>
                <p className="text-sm text-blue-600">{currentRoute.address}</p>
              </div>
            </div>
          </section>
        )}

        {/* Filtros e Lista */}
        <section className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Pontos de Coleta</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-lg px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas as prioridades</option>
                <option value="high">Alta prioridade</option>
                <option value="medium">Média prioridade</option>
                <option value="low">Baixa prioridade</option>
              </select>
            </div>
          </div>

          {/* Mapa Simulado */}
          <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 relative flex items-center justify-center border-b">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Mapa de São Luís - MA</p>
              <p className="text-sm text-gray-500">
                {filteredPoints.filter(p=> p.status === 'ready').length} pontos de coleta disponíveis
              </p>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {filteredPoints.filter(p => p.status !== 'completed').map(point => (
              <div key={point.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{point.establishmentName}</h4>
                      <p className="text-sm text-gray-600">{point.address}</p>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Navigation className="w-3 h-3" />{point.distance}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{point.estimatedTime}</span>
                        <span>Peso: {point.estimatedWeight}</span>
                        <span>Alerta há: {Math.floor((Date.now() - point.alertTime.getTime()) / 60000)} min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(point.priority)}`}>
                      {getPriorityText(point.priority)}
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${point.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {point.status === 'ready' ? 'Disponível' : 'Em Andamento'}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openNavigation(point)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1"
                      >
                        <Navigation className="w-4 h-4" /> Navegar
                      </button>
                      
                      {point.status === 'ready' && (
                        <button
                          type="button"
                          onClick={() => startCollection(point.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          Iniciar Coleta
                        </button>
                      )}
                      
                      {point.status === 'in_progress' && (
                        <button
                          type="button"
                          onClick={() => completeCollection(point.id)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          Concluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredPoints.filter(p => p.status === 'ready').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum ponto de coleta disponível no momento</p>
                <p className="text-sm">Novos pontos aparecerão aqui quando os estabelecimentos marcarem recipientes como cheios</p>
              </div>
            )}
          </div>
        </section>

        {/* Instruções */}
        <section className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Instruções para Coleta
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Use o botão "Navegar" para abrir o GPS e ir até o estabelecimento</li>
                  <li>Clique em "Iniciar Coleta" quando chegar no local</li>
                  <li>Após recolher o material, marque como "Concluir"</li>
                  <li>Pontos com prioridade alta devem ser coletados primeiro</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CollectorDashboard;
