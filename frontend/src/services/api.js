import axios from "axios";
import { auth } from "./firebase_config"; // Importe a instância do auth do Firebase

const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: apiUrl,
});

// Interceptor para adicionar o token de autenticação do Firebase a todas as requisições
api.interceptors.request.use(
  async (config) => {
    // Pega o usuário logado atualmente no Firebase
    const user = auth.currentUser;
    if (user) {
      // Pega o token de ID mais recente do usuário
      const token = await user.getIdToken();
      // Adiciona o token ao cabeçalho de autorização
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Trata erros da requisição
    return Promise.reject(error);
  },
);

export default api;
