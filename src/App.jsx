import { useState } from 'react';
import './App.css';
// Переконайтеся, що фото лежить за цим шляхом або змініть назву файлу
import heroImageUrl from './assets/hero-bg.webp'; 

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">GORILLA ARMOR</div>
        
        <button className="hamburger" onClick={toggleMenu} aria-label="Menu">
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <a href="#gallery" onClick={closeMenu}>Collection</a>
          <a href="#about" onClick={closeMenu}>The Forge</a>
          <a href="#calculator" onClick={closeMenu}>Configurator</a>
          <a href="#contacts" onClick={closeMenu}>Contacts</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero" style={{ backgroundImage: `url(${heroImageUrl})` }}>
        <div className="hero-overlay">
          <h1>Feel the spirit of the Middle Ages</h1>
          <p>Handmade medieval helmets forged with passion</p>
          <a href="#calculator" className="btn-primary">Build Your Helmet</a>
        </div>
      </header>

      {/* Gallery Section */}
      <section id="gallery" className="section">
        <h2 className="section-title">Our Masterpieces</h2>
        <div className="placeholder-box">
          <p>[ Gallery: 10 Helmet Models Coming Soon ]</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section bg-darker">
        <h2 className="section-title">The Craftsmanship</h2>
        <p className="about-text">
          Every helmet in <strong>Gorilla Armor</strong> is a result of meticulous handwork. 
          We combine historical accuracy with modern safety standards for reenactors and collectors worldwide.
        </p>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="section">
        <h2 className="section-title">Helmet Configurator</h2>
        <div className="calculator-placeholder">
          <p>Interactive calculator is being forged... 🔨</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacts" className="footer">
        <div className="footer-content">
          <p>GORILLA ARMOR | UKRAINE</p>
          <div className="social-links">
            <a href="#">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;