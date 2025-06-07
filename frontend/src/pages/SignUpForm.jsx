import React, { useState } from "react";
import {
  MapPin,
  Users,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { useAuth, validaCPF } from "../services/auth";
import { toast } from "react-toastify";
import { IMaskInput } from "react-imask";

const SignupForm = ({ userType, onBack, onToggleForm }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    password: "",
    confirmPassword: "",
    ...(userType === "establishment" && { address: "" }),
    ...(userType === "collector" && { license: "" }),
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      return "Este campo é obrigatório.";
    }

    switch (name) {
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Formato de email inválido.";
        }
        break;
      case "document":
        const unmaskedValue = value.replace(/[^\d]/g, "");
        if (userType === "collector" && !validaCPF(unmaskedValue)) {
          error = "CPF inválido.";
        }
        if (userType === "establishment" && unmaskedValue.length !== 14) {
          error = "CNPJ deve conter 14 dígitos.";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "A senha deve ter no mínimo 6 caracteres.";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "As senhas não coincidem.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));

    if (name === "password") {
      const confirmPasswordError = validateField(
        "confirmPassword",
        formData.confirmPassword,
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmPasswordError }));
    }
  };

  const isFormInvalid = () => {
    const requiredFields = [
      "name",
      "email",
      "phone",
      "document",
      "password",
      "confirmPassword",
    ];
    if (userType === "establishment") {
      requiredFields.push("address");
    }
    if (userType === "collector") {
      requiredFields.push("license");
    }

    for (const field of requiredFields) {
      if (!formData[field]) return true;
    }
    for (const error of Object.values(errors)) {
      if (error) return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataToSubmit = {
      ...formData,
      userType: userType,
    };

    const result = await signup(dataToSubmit);
    if (result.success) {
      toast.success("Cadastro realizado com sucesso!");
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const userTypeText =
    userType === "establishment" ? "Estabelecimento" : "Coletor";
  const bgColor =
    userType === "establishment"
      ? "from-blue-50 to-indigo-50"
      : "from-green-50 to-emerald-50";
  const primaryColor = userType === "establishment" ? "blue" : "green";
  const documentLabel = userType === "establishment" ? "CNPJ" : "CPF";
  const documentMask =
    userType === "establishment" ? "00.000.000/0000-00" : "000.000.000-00";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgColor} flex items-center justify-center p-4`}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8 relative">
          <button
            onClick={onBack}
            className="absolute left-0 top-0 p-2 text-gray-600 hover:text-gray-800 transition-colors"
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
            Cadastro {userTypeText}
          </h1>
          <p className="text-gray-600">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {userType === "establishment"
                ? "Nome do Estabelecimento"
                : "Nome Completo"}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={
                  userType === "establishment"
                    ? "Nome do seu estabelecimento"
                    : "Seu nome completo"
                }
                required
              />
            </div>
            {errors.name && (
              <p className="text-red-600 text-xs mt-1">{errors.name}</p>
            )}
          </div>

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
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <IMaskInput
                mask="(00) 00000-0000"
                name="phone"
                value={formData.phone}
                onAccept={(value) =>
                  handleChange({ target: { name: "phone", value } })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(98) 99999-9999"
                required
              />
            </div>
            {errors.phone && (
              <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {documentLabel}
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <IMaskInput
                mask={documentMask}
                name="document"
                value={formData.document}
                onAccept={(value) =>
                  handleChange({ target: { name: "document", value } })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={documentMask}
                required
              />
            </div>
            {errors.document && (
              <p className="text-red-600 text-xs mt-1">{errors.document}</p>
            )}
          </div>

          {userType === "establishment" && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Endereço
              </label>
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
              {errors.address && (
                <p className="text-red-600 text-xs mt-1">{errors.address}</p>
              )}
            </div>
          )}

          {userType === "collector" && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                CNH
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <IMaskInput
                  mask="12345678911"
                  name="license"
                  value={formData.license}
                  onAccept={(value) =>
                    handleChange({ target: { name: "license", value } })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CNH (Número de registro)"
                  required
                />
              </div>
              {errors.license && (
                <p className="text-red-600 text-xs mt-1">{errors.license}</p>
              )}
            </div>
          )}

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
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirmar Senha
            </label>
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
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isFormInvalid() || loading}
            className={`w-full bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleForm}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Já tem conta?{" "}
              <span className={`text-${primaryColor}-600 font-medium`}>
                Faça login
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
