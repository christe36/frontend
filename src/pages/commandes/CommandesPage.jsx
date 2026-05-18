import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package, Filter } from 'lucide-react';
import { getCommandes, createCommande, updateCommande, deleteCommande } from '../../api/commandes';
import { getClients } from '../../api/clients';
import { getOuvriers } from '../../api/ouvriers';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';
import './CommandesPage.css';

const STATUTS = ['en_attente','en_cours','terminee','annulee'];
const STATUT_LABELS = { en_attente:'En attente', en_cours:'En cours', terminee:'Terminée', annulee:'Annulée' };
const STATUT_COLORS = { en_attente:'warning', en_cours:'info', terminee:'success', annulee:'danger' };
const PAIEMENT_LABELS = { non_paye:'Non payée', acompte:'Acompte', paye:'Payée' };

const EMPTY = { client:'', ouvrier:'', description:'', memo:'', statut:'en_attente', statut_paiement:'non_paye', montant_total:'', montant_avance:'0', date_livraison:'' };

export default function CommandesPage() {
  const [commandes, setCommandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [ouvriers, setOuvriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      getCommandes(filterStatut ? { statut: filterStatut } : {}),
      getClients(),
      getOuvriers(),
    ]).then(([c, cl, o]) => {
      setCommandes(c.data.results || c.data);
      setClients(cl.data.results || cl.data);
      setOuvriers(o.data.results || o.data);
    }).catch(() => toast.error('Erreur chargement')).finally(() => setLoading(false));
  };

  useEffect(load, [filterStatut]);

  const openAdd = () => { setForm(EMPTY); setSelected(null); setModal('add'); };
  const openEdit = (c) => { setForm({...c, client: c.client, ouvrier: c.ouvrier || ''}); setSelected(c); setModal('edit'); };
  const closeModal = () => setModal(null);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, montant_avance: form.montant_avance || 0 };
      if (modal === 'add') { await createCommande(payload); toast.success('Commande créée !'); }
      else { await updateCommande(selected.id, payload); toast.success('Commande modifiée !'); }
      closeModal(); load();
    } catch { toast.error('Erreur lors de la sauvegarde'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette commande ?')) return;
    await deleteCommande(id); toast.success('Commande supprimée'); load();
  };

  const filtered = commandes.filter(c =>
    c.description?.toLowerCase().includes(search.toLowerCase()) ||
    c.client_detail?.nom?.toLowerCase().includes(search.toLowerCase()) ||
    c.client_detail?.prenom?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <PageHeader title="Commandes" subtitle={`${commandes.length} commande(s)`}
        action={<button className="btn btn-primary" onClick={openAdd}><Plus size={16}/> Nouvelle commande</button>}
      />

      <div className="card fade-in">
        <div className="table-toolbar">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input className="input search-input" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-tabs">
            <button className={`filter-tab ${filterStatut==='' ? 'active' : ''}`} onClick={() => setFilterStatut('')}>Tous</button>
            {STATUTS.map(s => (
              <button key={s} className={`filter-tab ${filterStatut===s ? 'active' : ''}`} onClick={() => setFilterStatut(s)}>
                {STATUT_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div>{[...Array(5)].map((_,i) => <div key={i} className="skeleton" style={{height:52,marginBottom:8}} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><Package size={40}/><h3>Aucune commande</h3><p>Créez votre première commande</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Client</th><th>Description</th><th>Ouvrier</th><th>Statut</th><th>Paiement</th><th>Montant</th><th>Livraison</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="fade-in">
                    <td>
                      <div className="client-cell">
                        <div className="client-avatar">{c.client_detail?.prenom?.[0]}{c.client_detail?.nom?.[0]}</div>
                        <strong>{c.client_detail?.prenom} {c.client_detail?.nom}</strong>
                      </div>
                    </td>
                    <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.description}</td>
                    <td>{c.ouvrier_detail ? `${c.ouvrier_detail.prenom} ${c.ouvrier_detail.nom}` : <span style={{color:'var(--text-muted)'}}>—</span>}</td>
                    <td><span className={`badge badge-${STATUT_COLORS[c.statut]}`}>{STATUT_LABELS[c.statut]}</span></td>
                    <td><span className={`badge badge-${c.statut_paiement==='paye'?'success':c.statut_paiement==='acompte'?'warning':'neutral'}`}>{PAIEMENT_LABELS[c.statut_paiement]}</span></td>
                    <td><strong>{new Intl.NumberFormat('fr-FR').format(c.montant_total)} F</strong></td>
                    <td>{c.date_livraison ? new Date(c.date_livraison).toLocaleDateString('fr-FR') : '—'}</td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn" onClick={() => openEdit(c)}><Edit2 size={14}/></button>
                        <button className="icon-btn danger" onClick={() => handleDelete(c.id)}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{maxWidth:600}}>
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Nouvelle commande' : 'Modifier la commande'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="input-group">
                  <label>Client *</label>
                  <select className="input" value={form.client} onChange={e => set('client', e.target.value)}>
                    <option value="">Sélectionner un client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Ouvrier assigné</label>
                  <select className="input" value={form.ouvrier} onChange={e => set('ouvrier', e.target.value)}>
                    <option value="">Aucun</option>
                    {ouvriers.map(o => <option key={o.id} value={o.id}>{o.prenom} {o.nom}</option>)}
                  </select>
                </div>
                <div className="input-group" style={{gridColumn:'span 2'}}>
                  <label>Description *</label>
                  <textarea className="input" rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Ex: Boubou en bazin bleu, 3 pièces..." />
                </div>
                <div className="input-group" style={{gridColumn:'span 2'}}>
                  <label>Mémo (rappel interne)</label>
                  <input className="input" value={form.memo} onChange={e => set('memo', e.target.value)} placeholder="Note rapide..." />
                </div>
                <div className="input-group">
                  <label>Statut</label>
                  <select className="input" value={form.statut} onChange={e => set('statut', e.target.value)}>
                    {STATUTS.map(s => <option key={s} value={s}>{STATUT_LABELS[s]}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Paiement</label>
                  <select className="input" value={form.statut_paiement} onChange={e => set('statut_paiement', e.target.value)}>
                    <option value="non_paye">Non payée</option>
                    <option value="acompte">Acompte versé</option>
                    <option value="paye">Payée</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Montant total (FCFA)</label>
                  <input className="input" type="number" value={form.montant_total} onChange={e => set('montant_total', e.target.value)} placeholder="0" />
                </div>
                <div className="input-group">
                  <label>Avance reçue (FCFA)</label>
                  <input className="input" type="number" value={form.montant_avance} onChange={e => set('montant_avance', e.target.value)} placeholder="0" />
                </div>
                <div className="input-group" style={{gridColumn:'span 2'}}>
                  <label>Date de livraison</label>
                  <input className="input" type="date" value={form.date_livraison} onChange={e => set('date_livraison', e.target.value)} />
                </div>
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20}}>
                <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.client || !form.description}>
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
