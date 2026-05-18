import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Ruler, User } from 'lucide-react';
import { getClients, createClient, updateClient, deleteClient } from '../../api/clients';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';
import './ClientsPage.css';

const EMPTY_FORM = { nom:'', prenom:'', email:'', telephone:'', categorie:'homme', adresse:'', notes:'' };

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getClients().then(r => setClients(r.data.results || r.data)).catch(() => toast.error('Erreur chargement')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY_FORM); setSelected(null); setModal('add'); };
  const openEdit = (c) => { setForm(c); setSelected(c); setModal('edit'); };
  const closeModal = () => setModal(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === 'add') { await createClient(form); toast.success('Client ajouté !'); }
      else { await updateClient(selected.id, form); toast.success('Client modifié !'); }
      closeModal(); load();
    } catch (e) {
      toast.error('Erreur lors de la sauvegarde');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce client ?')) return;
    await deleteClient(id);
    toast.success('Client supprimé');
    load();
  };

  const filtered = clients.filter(c =>
    `${c.prenom} ${c.nom} ${c.telephone}`.toLowerCase().includes(search.toLowerCase())
  );

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <DashboardLayout>
      <PageHeader title="Clients" subtitle={`${clients.length} client(s) enregistré(s)`}
        action={<button className="btn btn-primary" onClick={openAdd}><Plus size={16}/> Ajouter</button>}
      />

      <div className="card fade-in">
        <div className="table-toolbar">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input className="input search-input" placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {['tous','homme','femme','enfant'].map(f => (
              <button key={f} className="filter-tab">{f.charAt(0).toUpperCase()+f.slice(1)}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="skeleton-rows">{[...Array(5)].map((_,i) => <div key={i} className="skeleton" style={{height:52,marginBottom:8}} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <User size={40} />
            <h3>Aucun client trouvé</h3>
            <p>Ajoutez votre premier client en cliquant sur "+ Ajouter"</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nom</th><th>Contact</th><th>Catégorie</th><th>Ajouté le</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="fade-in">
                    <td>
                      <div className="client-cell">
                        <div className="client-avatar">{c.prenom[0]}{c.nom[0]}</div>
                        <div><strong>{c.prenom} {c.nom}</strong><p style={{fontSize:12,color:'var(--text-muted)'}}>{c.email}</p></div>
                      </div>
                    </td>
                    <td>{c.telephone}</td>
                    <td><span className={`badge badge-${c.categorie === 'homme' ? 'info' : c.categorie === 'femme' ? 'warning' : 'success'}`}>{c.categorie}</span></td>
                    <td>{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn" title="Modifier" onClick={() => openEdit(c)}><Edit2 size={14}/></button>
                        <button className="icon-btn danger" title="Supprimer" onClick={() => handleDelete(c.id)}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Ajouter un client' : 'Modifier le client'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="input-group"><label>Prénom *</label><input className="input" value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Prénom" /></div>
                <div className="input-group"><label>Nom *</label><input className="input" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Nom" /></div>
                <div className="input-group"><label>Téléphone *</label><input className="input" value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="07 00 00 00 00" /></div>
                <div className="input-group"><label>Email</label><input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@exemple.com" /></div>
                <div className="input-group" style={{gridColumn:'span 2'}}>
                  <label>Catégorie du vêtement</label>
                  <div className="cat-selector">
                    {['homme','femme','enfant'].map(cat => (
                      <button key={cat} type="button" className={`cat-btn ${form.categorie === cat ? 'active' : ''}`} onClick={() => set('categorie', cat)}>
                        {cat.charAt(0).toUpperCase()+cat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="input-group" style={{gridColumn:'span 2'}}><label>Notes</label><textarea className="input" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Préférences, remarques..." /></div>
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20}}>
                <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.prenom || !form.telephone}>
                  {saving ? <span className="spinner"/> : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
