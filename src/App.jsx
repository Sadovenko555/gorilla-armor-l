import './App.css';
import heroImageUrl from './assets/hero-bg.webp';

function App() {
  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">GORILLA ARMOUR</div>
        <div className="nav-links">
          <a href="#gallery">Collection</a>
          <a href="#about">The Forge</a>
          <a href="#calculator">Configurator</a>
          <a href="#contacts">Contacts</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header 
        className="hero" 
        style={{ backgroundImage: `url(${heroImageUrl})` }} // Передаємо фото
      >
        <div className="hero-overlay">
          {/* ... контент ... */}
        </div>
      </header>

      {/* Gallery Placeholder */}
      <section id="gallery" className="section">
        <h2 className="section-title">Our Masterpieces</h2>
        <div className="placeholder-box">
          [ Gallery with 10 helmet models will be here ]
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section bg-darker">
        <h2 className="section-title">The Craftsmanship</h2>
        <p className="about-text">
          Every helmet in <strong>Gorilla Armour</strong> is a result of meticulous handwork. 
          We combine historical accuracy with modern safety standards for reenactors and collectors worldwide.
        </p>
      </section>

      {/* Calculator Placeholder */}
      <section id="calculator" className="section">
        <h2 className="section-title">Helmet Configurator</h2>
        <div className="calculator-placeholder">
          <p>Step-by-step order calculation coming soon...</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacts" className="footer">
        <div className="footer-content">
          <p>GORILLA ARMOUR | UKRAINE</p>
          <div className="social-links">
            <a href="#">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;