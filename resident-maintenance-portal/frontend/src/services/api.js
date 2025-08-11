import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const submitMaintenanceRequest = async (requestData) => {
  const response = await api.post('/maintenance-requests', requestData);
  return response.data;
};

export const adminLogin = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export const getMaintenanceRequests = async () => {
  const response = await api.get('/maintenance-requests');
  return response.data;
};

export const closeMaintenanceRequest = async (id) => {
  const response = await api.put(`/maintenance-requests/${id}/close`);
  return response.data;
};
