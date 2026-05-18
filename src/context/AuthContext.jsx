import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [atelier, setAtelier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      getMe().then(res => {
        setUser(res.data);
        const stored = localStorage.getItem('atelier');
        if (stored) setAtelier(JSON.parse(stored));
      }).catch(() => {
        localStorage.clear();
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    const { access, refresh, user: u, atelier: a } = res.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('atelier', JSON.stringify(a));
    setUser(u);
    setAtelier(a);
    return res.data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAtelier(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, atelier, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
