import React, { useState, useEffect } from 'react';
import { MapPin, Trash2, Users, BarChart3, CheckCircle, AlertCircle, Star, Phone, Clock, Package, Filter, Navigation, Bell } from 'lucide-react';

const App = () => {
  const [userType, setUserType] = useState(''); // 'establishment' or 'collector'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'full', 'partial', 'empty'
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Novo recipiente cheio: Bar do João', time: '2min atrás', type: 'success' },
    { id: 2, message: 'Coleta realizada: Padaria São Luís', time: '1h atrás', type: 'info' }
  ]);
  const [collectionPoints, setCollectionPoints] = useState([
    {
      id: 1,
      name: 'Padaria São Luís',
      address: 'Rua Grande, 123 - Centro',
      lat: -2.5387,
      lng: -44.2825,
      status: 'full', // 'empty', 'partial', 'full'
      material: 'vidro',
      capacity: '50kg',
      filled: '50kg',
      phone: '(98) 3232-1234',
      lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 horas atrás
    },
    {
      id: 2,
      name: 'Restaurante Bem Bom',
      address: 'Av. Colares Moreira, 456 - Renascença',
      lat: -2.5298,
      lng: -44.2619,
      status: 'partial',
      material: 'vidro',
      capacity: '30kg',
      filled: '18kg',
      phone: '(98) 3243-5678',
      lastUpdate: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: 3,
      name: 'Bar do João',
      address: 'Rua do Sol, 789 - João Paulo',
      lat: -2.5187,
      lng: -44.2425,
      status: 'full',
      material: 'vidro',
      capacity: '25kg',
      filled: '25kg',
      phone: '(98) 3287-9012',
      lastUpdate: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 4,
      name: 'Lanchonete Central',
      address: 'Praça Benedito Leite, 321 - Centro',
      lat: -2.5297,
      lng: -44.3028,
      status: 'empty',
      material: 'vidro',
      capacity: '40kg',
      filled: '5kg',
      phone: '(98) 3234-5432',
      lastUpdate: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ]);

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [stats] = useState({
    totalCollected: 847,
    pointsAvailable: 2,
    thisWeek: 156,
    activePoints: 4
  });

  // Simular geolocalização
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Simular obtenção da localização do usuário
    setUserLocation({ lat: -2.5387, lng: -44.2825 });
  }, []);

  const updatePointStatus = (pointId, newStatus) => {
    setCollectionPoints(prev => 
      prev.map(point => 
        point.id === pointId 
          ? { ...point, status: newStatus, lastUpdate: new Date() }
          : point
      )
    );
    
    // Adicionar notificação
    if (newStatus === 'full') {
      const point = collectionPoints.find(p => p.id === pointId);
      setNotifications(prev => [{
        id: Date.now(),
        message: `Recipiente cheio: ${point?.name}`,
        time: 'agora',
        type: 'success'
      }, ...prev.slice(0, 4)]);
    }
  };

  const filteredPoints = collectionPoints.filter(point => {
    if (filterStatus === 'all') return true;
    return point.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'full': return 'text-red-600 bg-red-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'empty': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'full': return <AlertCircle className="w-4 h-4" />;
      case 'partial': return <Clock className="w-4 h-4" />;
      case 'empty': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'full': return 'Pronto para coleta';
      case 'partial': return 'Parcialmente cheio';
      case 'empty': return 'Vazio';
      default: return 'Indefinido';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m atrás`;
    }
    return `${minutes}m atrás`;
  };

  if (!userType) {
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
              onClick={() => setUserType('establishment')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Users className="w-6 h-6" />
              Sou Estabelecimento
            </button>
            
            <button
              onClick={() => setUserType('collector')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <MapPin className="w-6 h-6" />
              Sou Coletor
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (userType === 'establishment') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">EcoColeta SLZ</h1>
              <p className="text-blue-100 text-sm">Painel do Estabelecimento</p>
            </div>
            <button
              onClick={() => setUserType('')}
              className="bg-blue-400 hover:bg-blue-300 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Trocar Perfil
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Status do Recipiente</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-700 font-medium">Padaria São Luís</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor('full')}`}>
                  {getStatusIcon('full')}
                  {getStatusText('full')}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacidade:</span>
                  <span className="font-medium">50kg / 50kg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-red-500 h-3 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => updatePointStatus(1, 'empty')}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors"
              >
                Vazio
              </button>
              <button
                onClick={() => updatePointStatus(1, 'partial')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors"
              >
                Parcial
              </button>
              <button
                onClick={() => updatePointStatus(1, 'full')}
                className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors"
              >
                Cheio
              </button>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Como usar</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs">1</span>
                </div>
                <p>Monitore o recipiente de vidros instalado em seu estabelecimento</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs">2</span>
                </div>
                <p>Quando estiver cheio, marque como "Cheio" no app</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs">3</span>
                </div>
                <p>Nossa equipe será notificada e fará a coleta em breve</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">EcoColeta SLZ</h1>
            <p className="text-green-100 text-sm">Painel do Coletor</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{notifications.length}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setUserType('')}
              className="bg-green-400 hover:bg-green-300 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Trocar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Notificações */}
      {notifications.length > 0 && (
        <div className="p-4 pb-0">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <h4 className="font-semibold text-blue-800 text-sm mb-2">Notificações Recentes</h4>
            <div className="space-y-2">
              {notifications.slice(0, 2).map(notification => (
                <div key={notification.id} className="flex items-start gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-gray-700">{notification.message}</p>
                    <p className="text-gray-500 text-xs">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.pointsAvailable}</p>
                <p className="text-xs text-gray-600">Prontos para coleta</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalCollected}</p>
                <p className="text-xs text-gray-600">kg coletados (total)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.thisWeek}</p>
                <p className="text-xs text-gray-600">kg esta semana</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.activePoints}</p>
                <p className="text-xs text-gray-600">pontos ativos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa Simulado */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mapa de Coleta - São Luís/MA</h3>
          <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-xl h-64 relative overflow-hidden">
            {/* Simulação de mapa */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <path d="M50,50 Q200,20 350,50 Q380,150 350,250 Q200,280 50,250 Q20,150 50,50" 
                      fill="url(#gradient)" stroke="#4ade80" strokeWidth="2"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Marcadores */}
            {collectionPoints.map((point, index) => (
              <div
                key={point.id}
                className={`absolute w-8 h-8 rounded-full shadow-lg cursor-pointer transform hover:scale-110 transition-transform flex items-center justify-center ${
                  point.status === 'full' ? 'bg-red-500' : 
                  point.status === 'partial' ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{
                  left: `${20 + (index * 20)}%`,
                  top: `${30 + (index * 15)}%`
                }}
                onClick={() => setSelectedPoint(point)}
              >
                <MapPin className="w-4 h-4 text-white" />
              </div>
            ))}
            
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Cheio</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Parcial</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Vazio</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Pontos */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pontos de Coleta</h3>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="full">Cheios</option>
                <option value="partial">Parciais</option>
                <option value="empty">Vazios</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredPoints
              .sort((a, b) => {
                if (a.status === 'full' && b.status !== 'full') return -1;
                if (a.status !== 'full' && b.status === 'full') return 1;
                return 0;
              })
              .map((point) => (
                <div
                  key={point.id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    point.status === 'full' 
                      ? 'border-red-200 bg-red-50 hover:bg-red-100' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPoint(selectedPoint?.id === point.id ? null : point)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800">{point.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(point.status)}`}>
                          {getStatusIcon(point.status)}
                          {getStatusText(point.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{point.address}</p>
                      <p className="text-xs text-gray-500">
                        Atualizado {formatTimeAgo(point.lastUpdate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">{point.filled}</p>
                      <p className="text-xs text-gray-500">de {point.capacity}</p>
                    </div>
                  </div>
                  
                  {selectedPoint?.id === point.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-600 mb-1">Material:</p>
                          <p className="font-medium capitalize">{point.material}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Contato:</p>
                          <p className="font-medium">{point.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                          <Navigation className="w-4 h-4" />
                          Iniciar Rota
                        </button>
                        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                          <Phone className="w-4 h-4" />
                          Ligar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            
            {filteredPoints.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum ponto encontrado com este filtro</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;