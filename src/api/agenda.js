import api from './axios';
export const getRendezVous = (p) => api.get('/agenda/', { params: p });
export const createRendezVous = (d) => api.post('/agenda/', d);
export const updateRendezVous = (id, d) => api.put(`/agenda/${id}/`, d);
export const deleteRendezVous = (id) => api.delete(`/agenda/${id}/`);
