import api from './axios';
export const getAtelier = () => api.get('/ateliers/me/');
export const updateAtelier = (d) => api.put('/ateliers/me/', d);
