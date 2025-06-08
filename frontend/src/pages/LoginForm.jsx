// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../services/auth";
import { useParams, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(formData.email, formData.password, userType);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
    // Se o login for sucesso, o onAuthStateChanged fará o resto, e o ProtectedRoute irá redirecionar
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const userTypeText =
    userType === "establishment" ? "Estabelecimento" : "Coletor";
  const bgColor =
    userType === "establishment"
      ? "from-blue-50 to-indigo-50"
      : "from-green-50 to-emerald-50";
  const primaryColor = userType === "establishment" ? "blue" : "green";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgColor} flex items-center justify-center p-4`}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div
            className={`w-16 h-16 bg-${primaryColor}-500 rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            {userType === "establishment" ? (
              <Building className="w-8 h-8 text-white" />
            ) : (
              <Users className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Login {userTypeText}
          </h1>
          <p className="text-gray-600">Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
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
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
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
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              userType === "establishment"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate(`/signup/${userType}`)}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Não tem conta?{" "}
              <span className={`text-${primaryColor}-600 font-medium`}>
                Cadastre-se
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
