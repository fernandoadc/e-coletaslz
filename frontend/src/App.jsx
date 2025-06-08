import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom"; // Importar componentes do router
import { useAuth, AuthProvider } from "./services/auth";
import UserTypeSelector from "./pages/UserTypeSelector";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignUpForm";
import EstablishmentDashboard from "./pages/EstablishmentDashboard";
import CollectorDashboard from "./pages/CollectorDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./components/LoadingSpinner";

const ProtectedRoute = ({ expectedType }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Verifica se o tipo de usuário corresponde ao esperado
  if (expectedType && user.userType !== expectedType) {
    return <Navigate to="/" replace />;
  }

  return user.userType === "establishment" ? (
    <EstablishmentDashboard />
  ) : (
    <CollectorDashboard />
  );
};

// AuthLayout atualizado
const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Redireciona para o dashboard apropriado se já estiver autenticado
  if (user) {
    const redirectTo =
      user.userType === "establishment"
        ? "/dashboard/establishment"
        : "/dashboard/collector";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

// Atualize as rotas para usar a proteção adequada
const App = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<UserTypeSelector />} />
        <Route path="/login/:userType" element={<LoginForm />} />
        <Route path="/signup/:userType" element={<SignupForm />} />
      </Route>

      <Route
        path="/dashboard/establishment"
        element={<ProtectedRoute expectedType="establishment" />}
      />
      <Route
        path="/dashboard/collector"
        element={<ProtectedRoute expectedType="collector" />}
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// AppWithAuth continua o mesmo
const AppWithAuth = () => {
  return (
    <AuthProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthProvider>
  );
};

export default AppWithAuth;
