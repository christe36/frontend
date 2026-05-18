import api from './axios';
export const getOuvriers = () => api.get('/ouvriers/');
export const createOuvrier = (d) => api.post('/ouvriers/', d);
export const updateOuvrier = (id, d) => api.put(`/ouvriers/${id}/`, d);
export const deleteOuvrier = (id) => api.delete(`/ouvriers/${id}/`);
