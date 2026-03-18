import axios from 'axios';
import keycloak from '../utils/keycloak';

// Configuração base do Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para renovar token se expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await keycloak.updateToken(30);
        error.config.headers.Authorization = `Bearer ${keycloak.token}`;
        return axios.request(error.config);
      } catch {
        keycloak.login();
      }
    }
    return Promise.reject(error);
  }
);

export const getUserInfo = () => api.get('/user');
export const getAdminData = () => api.get('/admin');
export const getPublicData = () => api.get('/public');

export default api;