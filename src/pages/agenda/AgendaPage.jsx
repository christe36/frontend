import { useState, useEffect } from 'react';
import { Plus, Calendar, Trash2, Clock, User } from 'lucide-react';
import { getRendezVous, createRendezVous, deleteRendezVous } from '../../api/agenda';
import { getClients } from '../../api/clients';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';
import './AgendaPage.css';

const TYPES = { essayage:'Essayage', livraison:'Livraison', consultation:'Consultation', autre:'Autre' };
const TYPE_COLORS = { essayage:'#C17F3A', livraison:'#3D9970', consultation:'#5BA3F5', autre:'#9B59B6' };
const EMPTY = { client:'', type_rdv:'essayage', titre:'', date_heure:'', duree_minutes:60, notes:'' };

export default function AgendaPage() {
  const [rdvs, setRdvs] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getRendezVous(), getClients()])
      .then(([r, c]) => { setRdvs(r.data.results || r.data); setClients(c.data.results || c.data); })
      .catch(() => toast.error('Erreur'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await createRendezVous(form); toast.success('Rendez-vous ajouté !');
      setModal(false); load();
    } catch { toast.error('Erreur'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    await deleteRendezVous(id); toast.success('Supprimé'); load();
  };

  // Grouper par date
  const grouped = rdvs.reduce((acc, rdv) => {
    const d = new Date(rdv.date_heure).toDateString();
    if (!acc[d]) acc[d] = [];
    acc[d].push(rdv);
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <PageHeader title="Agenda" subtitle={`${rdvs.length} rendez-vous`}
        action={<button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal(true); }}><Plus size={16}/> Nouveau RDV</button>}
      />

      {loading ? (
        <div>{[...Array(3)].map((_,i) => <div key={i} className="skeleton" style={{height:80,marginBottom:12,borderRadius:12}} />)}</div>
      ) : rdvs.length === 0 ? (
        <div className="empty-state card"><Calendar size={40}/><h3>Aucun rendez-vous</h3><p>Planifiez vos essayages et livraisons</p></div>
      ) : (
        <div className="agenda-timeline stagger">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="agenda-day fade-in">
              <div className="day-label">{new Date(date).toLocaleDateString('fr-FR', {weekday:'long',day:'numeric',month:'long'})}</div>
              <div className="rdv-list">
                {items.map(rdv => (
                  <div key={rdv.id} className="rdv-card" style={{'--type-color': TYPE_COLORS[rdv.type_rdv]}}>
                    <div className="rdv-type-bar" />
                    <div className="rdv-info">
                      <div className="rdv-time">
                        <Clock size={12}/>
                        {new Date(rdv.date_heure).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
                        <span className="rdv-duration">· {rdv.duree_minutes} min</span>
                      </div>
                      <h4>{rdv.titre}</h4>
                      <div className="rdv-client">
                        <User size={12}/> {rdv.client_detail?.prenom} {rdv.client_detail?.nom}
                      </div>
                      {rdv.notes && <p className="rdv-notes">{rdv.notes}</p>}
                    </div>
                    <div className="rdv-meta">
                      <span className="badge" style={{background:`${TYPE_COLORS[rdv.type_rdv]}22`,color:TYPE_COLORS[rdv.type_rdv]}}>{TYPES[rdv.type_rdv]}</span>
                      <button className="icon-btn danger" onClick={() => handleDelete(rdv.id)}><Trash2 size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Nouveau rendez-vous</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div className="input-group"><label>Titre *</label><input className="input" value={form.titre} onChange={e => set('titre', e.target.value)} placeholder="Ex: Essayage robe de mariée" /></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                  <div className="input-group">
                    <label>Client *</label>
                    <select className="input" value={form.client} onChange={e => set('client', e.target.value)}>
                      <option value="">Sélectionner</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Type</label>
                    <select className="input" value={form.type_rdv} onChange={e => set('type_rdv', e.target.value)}>
                      {Object.entries(TYPES).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div className="input-group"><label>Date & heure *</label><input className="input" type="datetime-local" value={form.date_heure} onChange={e => set('date_heure', e.target.value)} /></div>
                  <div className="input-group"><label>Durée (min)</label><input className="input" type="number" value={form.duree_minutes} onChange={e => set('duree_minutes', e.target.value)} /></div>
                </div>
                <div className="input-group"><label>Notes</label><textarea className="input" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Remarques..." /></div>
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20}}>
                <button className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.titre || !form.client || !form.date_heure}>
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
