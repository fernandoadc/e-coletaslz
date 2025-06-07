import React, { useState } from "react";
import { useAuth, AuthProvider } from "./services/auth";
import UserTypeSelector from "./pages/UserTypeSelector";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignUpForm";
import EstablishmentDashboard from "./pages/EstablishmentDashboard";
import CollectorDashboard from "./pages/CollectorDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { user, loading } = useAuth();
  const [selectedUserType, setSelectedUserType] = useState("");
  const [authMode, setAuthMode] = useState("login"); // 'login' ou 'signup'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    if (user.userType === "establishment") {
      return <EstablishmentDashboard />;
    } else {
      return <CollectorDashboard />;
    }
  }

  if (!selectedUserType) {
    return <UserTypeSelector onSelectType={setSelectedUserType} />;
  }

  if (authMode === "login") {
    return (
      <LoginForm
        userType={selectedUserType}
        onBack={() => setSelectedUserType("")}
        onToggleForm={() => setAuthMode("signup")}
      />
    );
  } else {
    return (
      <SignupForm
        userType={selectedUserType}
        onBack={() => setSelectedUserType("")}
        onToggleForm={() => setAuthMode("login")}
      />
    );
  }
};

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
