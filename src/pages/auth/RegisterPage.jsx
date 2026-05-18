import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { register } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

const PLAN_INFO = {
  demo:    { label: 'Démo', price: '0 FCFA', color: '#6B6B6B' },
  basic:   { label: 'Basic', price: '10 000 FCFA/mois', color: '#C17F3A' },
  premium: { label: 'Premium', price: '30 000 FCFA/mois', color: '#2D4A3E' },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    atelier_nom: '', atelier_description: '', atelier_email: '', atelier_telephone: '',
    plan: 'demo', prenom: '', nom: '', email: '', telephone: '', mot_de_passe: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register(form);
      const res = await login(form.email, form.mot_de_passe);
      toast.success('Bienvenue ! Votre atelier est prêt 🎉');
      navigate('/dashboard');
    } catch (e) {
      const errors = e.response?.data;
      const msg = errors ? Object.values(errors).flat().join(' ') : 'Erreur lors de l\'inscription';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo"><Scissors size={20}/> e-couture</Link>
        <div className="auth-left-content">
          <h2>Rejoignez la communauté</h2>
          <p>+500 couturiers font confiance à e-couture pour gérer leur atelier.</p>
          <div className="auth-perks">
            {['Essai gratuit 30 jours','Sans engagement','Support francophone'].map(p => (
              <div key={p} className="perk"><Check size={14}/> {p}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          {/* Steps indicator */}
          <div className="steps-bar">
            {[1,2].map(s => (
              <div key={s} className={`step-dot ${step >= s ? 'done' : ''} ${step === s ? 'active' : ''}`}>
                {step > s ? <Check size={12}/> : s}
              </div>
            ))}
            <div className="steps-line" style={{width: step === 2 ? '100%' : '0%'}} />
          </div>

          {step === 1 && (
            <div className="auth-form fade-in">
              <h1>Créez votre atelier</h1>
              <p className="auth-subtitle">Étape 1 — Informations de l'atelier</p>

              <div className="input-group">
                <label>Nom de l'atelier *</label>
                <input className="input" placeholder="Ex: Atelier Koffi" value={form.atelier_nom} onChange={e => set('atelier_nom', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Description de l'activité</label>
                <textarea className="input" rows={2} placeholder="Confection de vêtements traditionnels..." value={form.atelier_description} onChange={e => set('atelier_description', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Email professionnel *</label>
                  <input className="input" type="email" placeholder="atelier@email.com" value={form.atelier_email} onChange={e => set('atelier_email', e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Téléphone *</label>
                  <input className="input" placeholder="01 02 03 04 05" value={form.atelier_telephone} onChange={e => set('atelier_telephone', e.target.value)} />
                </div>
              </div>

              <div className="input-group">
                <label>Choisissez votre formule</label>
                <div className="plan-selector">
                  {Object.entries(PLAN_INFO).map(([key, info]) => (
                    <div key={key} className={`plan-option ${form.plan === key ? 'selected' : ''}`} onClick={() => set('plan', key)} style={form.plan === key ? {borderColor: info.color, background: info.color+'11'} : {}}>
                      <strong style={{color: info.color}}>{info.label}</strong>
                      <span>{info.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary" style={{width:'100%', justifyContent:'center', marginTop:8}} onClick={() => setStep(2)} disabled={!form.atelier_nom || !form.atelier_email}>
                Suivant <ArrowRight size={16}/>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="auth-form fade-in">
              <h1>Votre profil</h1>
              <p className="auth-subtitle">Étape 2 — Informations personnelles</p>

              <div className="form-row">
                <div className="input-group">
                  <label>Prénom *</label>
                  <input className="input" placeholder="Jean" value={form.prenom} onChange={e => set('prenom', e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Nom *</label>
                  <input className="input" placeholder="Koffi" value={form.nom} onChange={e => set('nom', e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>Email personnel *</label>
                <input className="input" type="email" placeholder="vous@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Téléphone</label>
                <input className="input" placeholder="07 00 00 00 00" value={form.telephone} onChange={e => set('telephone', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Mot de passe *</label>
                <input className="input" type="password" placeholder="Minimum 8 caractères" value={form.mot_de_passe} onChange={e => set('mot_de_passe', e.target.value)} />
              </div>

              <div className="form-btns">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>
                  <ArrowLeft size={16}/> Retour
                </button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !form.prenom || !form.email || !form.mot_de_passe}>
                  {loading ? <span className="spinner"/> : <><Check size={16}/> Créer mon atelier</>}
                </button>
              </div>
            </div>
          )}

          <p className="auth-switch">Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
        </div>
      </div>
    </div>
  );
}
