import api from './axios';
export const getCommandes = (p) => api.get('/commandes/', { params: p });
export const createCommande = (d) => api.post('/commandes/', d);
export const updateCommande = (id, d) => api.put(`/commandes/${id}/`, d);
export const deleteCommande = (id) => api.delete(`/commandes/${id}/`);
export const getStats = () => api.get('/commandes/stats/');
export const getGroupes = () => api.get('/commandes/groupes/');
export const createGroupe = (d) => api.post('/commandes/groupes/', d);
