import { useState, useEffect } from 'react';
import { Save, Building, Package, Shield } from 'lucide-react';
import { getAtelier, updateAtelier } from '../../api/atelier';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';
import './ParametresPage.css';

const TABS = [
  { id:'general', label:'Informations générales', icon: Building },
  { id:'packages', label:'Packages et historiques', icon: Package },
  { id:'limites', label:'Limites', icon: Shield },
];

const PLAN_LIMITS = {
  demo:    { tailleurs:5,  commandes:50,   clients:50,   essayages:50,  groupes:10  },
  basic:   { tailleurs:15, commandes:500,  clients:500,  essayages:100, groupes:50  },
  premium: { tailleurs:30, commandes:2000, clients:5000, essayages:300, groupes:200 },
};

export default function ParametresPage() {
  const [tab, setTab] = useState('general');
  const [atelier, setAtelier] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAtelier().then(r => { setAtelier(r.data); setForm(r.data); }).catch(() => {});
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateAtelier(form);
      setAtelier(res.data);
      toast.success('Paramètres sauvegardés !');
    } catch { toast.error('Erreur'); }
    finally { setSaving(false); }
  };

  const limits = PLAN_LIMITS[atelier?.plan || 'demo'];

  return (
    <DashboardLayout>
      <PageHeader title="Paramètres" subtitle="Gérez les informations de votre atelier" />
      <div className="params-layout">
        <div className="params-tabs">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`params-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              <Icon size={16}/> {label}
            </button>
          ))}
        </div>

        <div className="params-content card fade-in">
          {tab === 'general' && (
            <div>
              <h3 style={{marginBottom:24}}>Informations générales</h3>
              <div className="params-form">
                <div className="input-group"><label>Nom de l'atelier</label><input className="input" value={form.nom||''} onChange={e => set('nom', e.target.value)} /></div>
                <div className="input-group"><label>Description</label><textarea className="input" rows={2} value={form.description||''} onChange={e => set('description', e.target.value)} /></div>
                <div className="input-group"><label>Email</label><input className="input" type="email" value={form.email||''} onChange={e => set('email', e.target.value)} /></div>
                <div className="input-group"><label>Téléphone</label><input className="input" value={form.telephone||''} onChange={e => set('telephone', e.target.value)} /></div>
                <div className="input-group"><label>Pays</label><input className="input" value={form.pays||''} onChange={e => set('pays', e.target.value)} /></div>
                <div className="input-group"><label>Ville</label><input className="input" value={form.ville||''} onChange={e => set('ville', e.target.value)} /></div>
                <div className="input-group" style={{gridColumn:'span 2'}}><label>Adresse</label><textarea className="input" rows={2} value={form.adresse||''} onChange={e => set('adresse', e.target.value)} /></div>
              </div>
              <div style={{marginTop:24}}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? <span className="spinner"/> : <><Save size={15}/> Sauvegarder</>}
                </button>
              </div>
            </div>
          )}

          {tab === 'packages' && (
            <div>
              <h3 style={{marginBottom:8}}>Votre formule actuelle</h3>
              <p style={{color:'var(--text-muted)',fontSize:14,marginBottom:24}}>Historique et gestion de votre abonnement.</p>
              <div className="plan-info-card">
                <span className="badge badge-warning" style={{fontSize:14,padding:'6px 16px'}}>Formule {(atelier?.plan||'demo').toUpperCase()}</span>
                <p style={{marginTop:12,color:'var(--text-muted)',fontSize:14}}>
                  {atelier?.plan==='demo' ? 'Gratuit — idéal pour tester' : atelier?.plan==='basic' ? '10 000 FCFA / mois' : '30 000 FCFA / mois'}
                </p>
                {atelier?.trial_ends_at && <p style={{marginTop:8,fontSize:13,color:'var(--warning)'}}>⏰ Essai jusqu'au {new Date(atelier.trial_ends_at).toLocaleDateString('fr-FR')}</p>}
              </div>
              <div style={{marginTop:24,display:'flex',gap:10}}>
                <a href="#" className="btn btn-primary">Changer de formule</a>
                <a href="mailto:contact@e-couture.com" className="btn btn-outline">Support</a>
              </div>
            </div>
          )}

          {tab === 'limites' && limits && (
            <div>
              <h3 style={{marginBottom:8}}>Limites de votre formule</h3>
              <p style={{color:'var(--text-muted)',fontSize:14,marginBottom:24}}>Quotas associés à votre plan actuel.</p>
              <div className="limits-grid">
                {[{label:'Tailleurs',val:limits.tailleurs,icon:'👨‍🎨'},{label:'Commandes',val:limits.commandes,icon:'📦'},{label:'Clients',val:limits.clients,icon:'👥'},{label:'Essayages',val:limits.essayages,icon:'📅'},{label:'Groupes',val:limits.groupes,icon:'📂'}].map(({ label, val, icon }) => (
                  <div key={label} className="limit-card card">
                    <span className="limit-icon">{icon}</span>
                    <p className="limit-val">{val.toLocaleString('fr-FR')}</p>
                    <p className="limit-label">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
