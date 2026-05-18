import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, UserCheck, Package } from 'lucide-react';
import { getOuvriers, createOuvrier, updateOuvrier, deleteOuvrier } from '../../api/ouvriers';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';
import './OuvriersPage.css';

const EMPTY = { prenom:'', nom:'', email:'', telephone:'', specialite:'' };

export default function OuvriersPage() {
  const [ouvriers, setOuvriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getOuvriers().then(r => setOuvriers(r.data.results || r.data)).catch(() => toast.error('Erreur')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY); setSelected(null); setModal('add'); };
  const openEdit = (o) => { setForm(o); setSelected(o); setModal('edit'); };
  const closeModal = () => setModal(null);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === 'add') { await createOuvrier(form); toast.success('Ouvrier ajouté !'); }
      else { await updateOuvrier(selected.id, form); toast.success('Ouvrier modifié !'); }
      closeModal(); load();
    } catch { toast.error('Erreur lors de la sauvegarde'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet ouvrier ?')) return;
    await deleteOuvrier(id); toast.success('Ouvrier supprimé'); load();
  };

  const initials = (o) => `${o.prenom?.[0]||''}${o.nom?.[0]||''}`.toUpperCase();
  const colors = ['#C17F3A','#2D4A3E','#5BA3F5','#9B59B6','#3D9970','#E74C3C'];

  return (
    <DashboardLayout>
      <PageHeader title="Mes ouvriers" subtitle={`${ouvriers.length} tailleur(s) dans votre atelier`}
        action={<button className="btn btn-primary" onClick={openAdd}><Plus size={16}/> Ajouter un ouvrier</button>}
      />

      {loading ? (
        <div className="ouvriers-grid stagger">
          {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{height:180,borderRadius:12}} />)}
        </div>
      ) : ouvriers.length === 0 ? (
        <div className="empty-state card"><UserCheck size={40}/><h3>Aucun ouvrier</h3><p>Ajoutez les tailleurs de votre atelier</p></div>
      ) : (
        <div className="ouvriers-grid stagger">
          {ouvriers.map((o, idx) => (
            <div key={o.id} className="ouvrier-card card fade-in">
              <div className="ouvrier-avatar" style={{background: colors[idx % colors.length]}}>
                {initials(o)}
              </div>
              <h3>{o.prenom} {o.nom}</h3>
              {o.specialite && <p className="ouvrier-spec">{o.specialite}</p>}
              <p className="ouvrier-contact">{o.telephone || o.email || '—'}</p>

              <div className="ouvrier-stats">
                <div className="ouvrier-stat">
                  <Package size={13}/>
                  <span>{o.commandes_en_cours ?? 0} en cours</span>
                </div>
                <div className="ouvrier-stat">
                  <Package size={13}/>
                  <span>{o.commandes_totales ?? 0} total</span>
                </div>
              </div>

              <div className="ouvrier-actions">
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(o)}><Edit2 size={13}/> Modifier</button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(o.id)}><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Ajouter un ouvrier' : 'Modifier l\'ouvrier'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div className="input-group"><label>Prénom *</label><input className="input" value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Prénom" /></div>
                <div className="input-group"><label>Nom *</label><input className="input" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Nom" /></div>
                <div className="input-group"><label>Téléphone</label><input className="input" value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="07 00 00 00 00" /></div>
                <div className="input-group"><label>Email</label><input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@ex.com" /></div>
                <div className="input-group" style={{gridColumn:'span 2'}}><label>Spécialité</label><input className="input" value={form.specialite} onChange={e => set('specialite', e.target.value)} placeholder="Ex: Boubou, costumes, robes..." /></div>
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20}}>
                <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.prenom || !form.nom}>
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
