import axios from 'axios';
import { Platform } from 'react-native';

const DEFAULT_LOCAL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
const baseURL = DEFAULT_LOCAL || 'http://10.87.169.71:8080';

const api = axios.create({
  baseURL,
});

export function getApiErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (typeof error?.response?.data === 'string') return error.response.data;
  if (error?.response?.status) return `Erro ${error.response.status} na API.`;
  if (error?.request) return 'Nao foi possivel conectar na API.';
  return error?.message ?? 'Erro inesperado.';
}

export function logApiError(context, error) {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const message = getApiErrorMessage(error);

  console.log(`[API] ${context}`, {
    status,
    message,
    data,
  });
}

export default api;
