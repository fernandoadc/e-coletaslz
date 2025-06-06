// src/components/auth/SignupForm.jsx
import React, { useState } from 'react';
import { MapPin, Users, Eye, EyeOff, Mail, Lock, User, Phone, Building, ArrowLeft } from 'lucide-react';
import { useAuth } from '../services/Auth';

// Componente de Cadastro
const SignupForm = ({ userType, onBack, onToggleForm }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    ...(userType === 'establishment' && { address: '' }),
    ...(userType === 'collector' && { license: '' })
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    const dataToSubmit = {
      ...formData,
      userType
    };

    const result = await signup(dataToSubmit);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const userTypeText = userType === 'establishment' ? 'Estabelecimento' : 'Coletor';
  const bgColor = userType === 'establishment' ? 'from-blue-50 to-indigo-50' : 'from-green-50 to-emerald-50';
  const primaryColor = userType === 'establishment' ? 'blue' : 'green';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgColor} flex items-center justify-center p-4`}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className={`w-16 h-16 bg-${primaryColor}-500 rounded-full flex items-center justify-center mx-auto mb-4`}>
            {userType === 'establishment' ? (
              <Building className="w-8 h-8 text-white" />
            ) : (
              <Users className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Cadastro {userTypeText}</h1>
          <p className="text-gray-600">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {userType === 'establishment' ? 'Nome do Estabelecimento' : 'Nome Completo'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={userType === 'establishment' ? 'Nome do seu estabelecimento' : 'Seu nome completo'}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(98) 99999-9999"
                required
              />
            </div>
          </div>

          {userType === 'establishment' && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Endereço</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Endereço completo"
                  required
                />
              </div>
            </div>
          )}

          {userType === 'collector' && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Licença/CNH</label>
              <input
                type="text"
                name="license"
                value={formData.license}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Número da licença"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Senha</label>
            <div className="relative">
              <Lock className="abstract left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirme sua senha"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleForm}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Já tem conta? <span className={`text-${primaryColor}-600 font-medium`}>Faça login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
