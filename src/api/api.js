import axios from 'axios';
import { Platform } from 'react-native';

const DEFAULT_LOCAL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
const baseURL = DEFAULT_LOCAL || 'http://10.87.169.71:8080';

const api = axios.create({
  baseURL,
});

// Helpers de endpoint — centralizados aqui para não espalhar pela app
export const endpoints = {
  categorias: {
    listar:  () => api.get('/categoria'),
    criar:   (dados) => api.post('/categoria', dados),
    editar:  (id, dados) => api.put(`/categoria/${id}?id=${id}`, dados), // API usa req.query.id
    deletar: (id) => api.delete(`/categoria/${id}`),
  },
  produtos: {
    listar:  () => api.get('/produto'),
    criar:   (dados) => api.post('/produto', dados),
    editar:  (id, dados) => api.put(`/produto?id=${id}`, dados), // API usa req.query.id e PUT sem /:id
    deletar: (id) => api.delete(`/produto/${id}`),
  },
};

// A API de categoria retorna { result: [...] }, produto retorna [] direto
export function getList(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.result)) return responseData.result;
  if (Array.isArray(responseData?.Result)) return responseData.Result;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

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
  console.log(`[API] ${context}`, { status, message, data });
}

export default api;