import api from './axios';
export const getClients = (p) => api.get('/clients/', { params: p });
export const getClient = (id) => api.get(`/clients/${id}/`);
export const createClient = (d) => api.post('/clients/', d);
export const updateClient = (id, d) => api.put(`/clients/${id}/`, d);
export const deleteClient = (id) => api.delete(`/clients/${id}/`);
export const getMesures = (id) => api.get(`/clients/${id}/mesures/`);
export const updateMesures = (id, d) => api.put(`/clients/${id}/mesures/`, d);
