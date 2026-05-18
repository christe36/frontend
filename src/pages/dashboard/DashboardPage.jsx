import { useEffect, useState } from 'react';
import { Package, Users, TrendingUp, Clock, UserCheck, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStats } from '../../api/commandes';
import { getClients } from '../../api/clients';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';

const MOCK_CHART = [
  { mois: 'Jan', commandes: 12 }, { mois: 'Fév', commandes: 19 },
  { mois: 'Mar', commandes: 15 }, { mois: 'Avr', commandes: 22 },
  { mois: 'Mai', commandes: 18 }, { mois: 'Jui', commandes: 25 },
];

export default function DashboardPage() {
  const { user, atelier } = useAuth();
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getStats().then(r => setStats(r.data)).catch(() => {});
    getClients().then(r => setClients(r.data.results || r.data)).catch(() => {});
  }, []);

  const fmt = (n) => new Intl.NumberFormat('fr-FR').format(n || 0);

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dash-header fade-in">
          <div>
            <h1>Bienvenue, {user?.first_name} 👋</h1>
            <p>Voici un aperçu de votre atelier <strong>{atelier?.nom}</strong></p>
          </div>
          <Link to="/commandes/new" className="btn btn-primary">
            <Plus size={16}/> Nouvelle commande
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid stagger">
          <div className="card"><StatCard label="Chiffre d'affaires" value={`${fmt(stats?.chiffre_affaires)} FCFA`} icon={TrendingUp} color="#C17F3A" /></div>
          <div className="card"><StatCard label="Total commandes" value={stats?.total ?? 0} icon={Package} color="#2D4A3E" /></div>
          <div className="card"><StatCard label="En cours" value={stats?.en_cours ?? 0} icon={Clock} color="#5BA3F5" /></div>
          <div className="card"><StatCard label="Clients" value={clients.length} icon={Users} color="#9B59B6" /></div>
        </div>

        <div className="dash-row">
          {/* Graphique */}
          <div className="card chart-card fade-in">
            <h3>Activité des 6 derniers mois</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MOCK_CHART}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE7" />
                <XAxis dataKey="mois" tick={{fontSize:12, fill:'#6B6B6B'}} axisLine={false} />
                <YAxis tick={{fontSize:12, fill:'#6B6B6B'}} axisLine={false} />
                <Tooltip contentStyle={{borderRadius:'8px',border:'none',boxShadow:'0 4px 16px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="commandes" fill="#C17F3A" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Statuts */}
          <div className="card status-card fade-in">
            <h3>Statut des commandes</h3>
            <div className="status-list">
              {[
                { label: 'En attente', val: stats?.en_attente ?? 0, color: '#FF851B' },
                { label: 'En cours',   val: stats?.en_cours ?? 0,   color: '#5BA3F5' },
                { label: 'Terminées',  val: stats?.terminees ?? 0,  color: '#3D9970' },
                { label: 'Payées',     val: stats?.payees ?? 0,     color: '#C17F3A' },
              ].map(({ label, val, color }) => (
                <div key={label} className="status-item">
                  <div className="status-dot" style={{background:color}} />
                  <span>{label}</span>
                  <strong>{val}</strong>
                  <div className="status-bar-wrap">
                    <div className="status-bar" style={{width:`${Math.min((val/(stats?.total||1))*100,100)}%`, background:color}} />
                  </div>
                </div>
              ))}
            </div>

            <div className="divider" />
            <div className="quick-actions">
              <Link to="/clients" className="quick-btn"><Users size={14}/> Clients</Link>
              <Link to="/ouvriers" className="quick-btn"><UserCheck size={14}/> Ouvriers</Link>
              <Link to="/agenda" className="quick-btn"><Clock size={14}/> Agenda</Link>
            </div>
          </div>
        </div>

        {/* Clients récents */}
        {clients.length > 0 && (
          <div className="card fade-in">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h3>Clients récents</h3>
              <Link to="/clients" className="btn btn-ghost btn-sm">Voir tout</Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Nom</th><th>Téléphone</th><th>Catégorie</th><th>Ajouté le</th></tr>
                </thead>
                <tbody>
                  {clients.slice(0,5).map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.prenom} {c.nom}</strong></td>
                      <td>{c.telephone}</td>
                      <td><span className="badge badge-neutral">{c.categorie}</span></td>
                      <td>{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
