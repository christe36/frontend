import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Package, UserCheck, Calendar, Settings, LogOut, Scissors } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/commandes', icon: Package, label: 'Commandes' },
  { to: '/ouvriers', icon: UserCheck, label: 'Mes ouvriers' },
  { to: '/agenda', icon: Calendar, label: 'Agenda' },
  { to: '/parametres', icon: Settings, label: 'Paramètres' },
];

export default function Sidebar() {
  const { user, atelier, logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Scissors size={22} />
        <span>e-couture</span>
      </div>

      <div className="sidebar-atelier">
        <div className="atelier-avatar">
          {atelier?.nom?.[0]?.toUpperCase() || 'A'}
        </div>
        <div>
          <p className="atelier-name">{atelier?.nom || 'Mon atelier'}</p>
          <span className={`badge badge-${atelier?.plan === 'premium' ? 'warning' : atelier?.plan === 'basic' ? 'info' : 'neutral'}`}>
            {atelier?.plan || 'demo'}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
          <div>
            <p className="user-name">{user?.first_name} {user?.last_name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="logout-btn" title="Déconnexion">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
