import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch {
      toast.error('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo"><Scissors size={20}/> e-couture</Link>
        <div className="auth-left-content">
          <h2>Bon retour parmi nous !</h2>
          <p>Gérez votre atelier efficacement depuis votre tableau de bord.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-form">
            <h1>Se connecter</h1>
            <p className="auth-subtitle">Accédez à votre espace atelier</p>

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
              <div className="input-group">
                <label>Email</label>
                <input className="input" type="email" placeholder="vous@email.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
              </div>
              <div className="input-group">
                <label>Mot de passe</label>
                <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center', marginTop:4}} disabled={loading}>
                {loading ? <span className="spinner"/> : 'Se connecter'}
              </button>
            </form>

            <p className="auth-switch">Pas encore de compte ? <Link to="/register">Créer un atelier</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
