import { Link } from 'react-router-dom';
import { Scissors, Users, Calendar, CreditCard, Image, Bell, Ruler, ArrowRight, Check } from 'lucide-react';
import './LandingPage.css';

const features = [
  { icon: Ruler, title: 'Suivi des mesures', desc: 'Centralisez les fiches de mesures de vos clients.' },
  { icon: Calendar, title: 'Gestion des rendez-vous', desc: 'Planifiez essayages et livraisons facilement.' },
  { icon: Users, title: 'Base clients complète', desc: 'Historique et préférences de chaque client.' },
  { icon: CreditCard, title: 'Facturation', desc: 'Générez devis et factures en un clic.' },
  { icon: Image, title: 'Galerie créations', desc: 'Cataloguez vos créations pour vos clients.' },
  { icon: Bell, title: 'Notifications', desc: 'Rappels automatiques, zéro oubli.' },
];

const plans = [
  { name: 'Démo', price: '0', period: '/mois', color: '#6B6B6B', features: ['5 tailleurs', '50 commandes', '50 clients', '50 essayages', '10 groupes'], cta: 'Essayer gratuitement' },
  { name: 'Basic', price: '10 000', period: ' FCFA/mois', color: '#C17F3A', popular: true, features: ['15 tailleurs', '500 commandes', '500 clients', '100 essayages', '50 groupes'], cta: 'Commencer' },
  { name: 'Premium', price: '30 000', period: ' FCFA/mois', color: '#2D4A3E', features: ['30 tailleurs', '2000 commandes', '5000 clients', '300 essayages', '200 groupes'], cta: 'Commencer' },
];

export default function LandingPage() {
  return (
    <div className="landing">
      {/* NAV */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <Scissors size={20} />
          <span>e-couture</span>
        </div>
        <div className="nav-links">
          <a href="#features">Fonctionnalités</a>
          <a href="#pricing">Tarifs</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-ghost btn-sm">Se connecter</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Commencer</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>
        <div className="hero-content">
          <div className="hero-badge fade-in">✨ Plus de 500 couturiers actifs</div>
          <h1 className="hero-title fade-in" style={{animationDelay:'0.1s'}}>
            Gérez votre atelier<br />
            <em>comme un pro</em>
          </h1>
          <p className="hero-sub fade-in" style={{animationDelay:'0.2s'}}>
            Fini les carnets griffonnés et les mesures perdues !<br />
            E-Couture centralise tout pour vous.
          </p>
          <div className="hero-cta fade-in" style={{animationDelay:'0.3s'}}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Commencer avec e-couture <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn btn-outline btn-lg">Voir les fonctionnalités</a>
          </div>
          <div className="hero-stats fade-in" style={{animationDelay:'0.4s'}}>
            <div className="hero-stat"><span className="stat-num">+500</span><span>Couturiers actifs</span></div>
            <div className="hero-stat"><span className="stat-num">98%</span><span>Satisfaction client</span></div>
            <div className="hero-stat"><span className="stat-num">24h/7</span><span>Support disponible</span></div>
          </div>
        </div>
        <div className="hero-img-wrap fade-in" style={{animationDelay:'0.2s'}}>
          <div className="hero-img-card">
            <div className="mock-dashboard">
              <div className="mock-sidebar">
                <div className="mock-logo" />
                {[...Array(5)].map((_, i) => <div key={i} className={`mock-nav-item ${i===0?'active':''}`} />)}
              </div>
              <div className="mock-content">
                <div className="mock-title" />
                <div className="mock-cards">
                  {['#C17F3A','#2D4A3E','#5BA3F5','#9B59B6'].map((c,i) => (
                    <div key={i} className="mock-card" style={{background: c+'22', borderColor: c+'44'}}>
                      <div className="mock-card-icon" style={{background:c}} />
                      <div className="mock-card-val" />
                    </div>
                  ))}
                </div>
                <div className="mock-chart">
                  {[60,80,45,90,55,75,85].map((h,i) => (
                    <div key={i} className="mock-bar" style={{height:`${h}%`, animationDelay:`${i*0.1}s`}} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Tout ce qu'il faut pour faire tourner votre atelier</h2>
          <p>Des outils pensés pour les artisans de la couture</p>
        </div>
        <div className="features-grid stagger">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card fade-in">
              <div className="feature-icon"><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing-section">
        <div className="section-header">
          <h2>Choisissez votre formule</h2>
          <p>Des options adaptées à chaque taille d'atelier</p>
        </div>
        <div className="pricing-grid stagger">
          {plans.map((plan) => (
            <div key={plan.name} className={`pricing-card fade-in ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Populaire</div>}
              <h3 style={{color: plan.color}}>{plan.name}</h3>
              <div className="plan-price">
                <span className="price-num" style={{color: plan.color}}>{plan.price}</span>
                <span className="price-period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map(f => (
                  <li key={f}><Check size={14} /> {f}</li>
                ))}
              </ul>
              <Link to="/register" className="btn btn-primary" style={{width:'100%',justifyContent:'center', background: plan.color}}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section" id="contact">
        <h2>Prêt à révolutionner votre atelier ?</h2>
        <p>Rejoignez déjà des centaines de couturiers qui ont choisi E-Couture</p>
        <div className="cta-btns">
          <Link to="/register" className="btn btn-primary btn-lg">Commencer maintenant</Link>
          <a href="mailto:contact@e-couture.com" className="btn btn-outline btn-lg">Nous contacter</a>
        </div>
        <p className="cta-legal">© 2025 E-Couture. Tous droits réservés.</p>
      </section>
    </div>
  );
}
