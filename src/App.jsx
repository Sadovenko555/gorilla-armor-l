import { useState, useRef } from 'react';
import './App.css';
import Calculator from './components/Calculator';
import heroImageUrl from './assets/hero-bg-3.webp'; 

// Массив изображений для карусели
const galleryImages = [
  { id: 1, src: '/images/1.webp', alt: 'Gorilla Armor Custom Helmet 1' },
  { id: 2, src: '/images/2.webp', alt: 'Gorilla Armor Custom Helmet 2' },
  { id: 3, src: '/images/3.webp', alt: 'Gorilla Armor Custom Helmet 3' },
  { id: 4, src: '/images/4.webp', alt: 'Gorilla Armor Custom Helmet 4' },
  { id: 5, src: '/images/5.webp', alt: 'Gorilla Armor Custom Helmet 5' },
  { id: 6, src: '/images/6.webp', alt: 'Gorilla Armor Custom Helmet 6' },
  { id: 7, src: '/images/7.webp',alt: 'Gorilla Armor Custom Helmet 7' },
  { id: 8, src: '/images/8.webp',alt: 'Gorilla Armor Custom Helmet 8' },
  { id: 9, src: '/images/9.webp',alt: 'Gorilla Armor Custom Helmet 9' },
  { id: 10, src: '/images/10.webp',alt: 'Gorilla Armor Custom Helmet 10' },
  { id: 11, src: '/images/11.webp',alt: 'Gorilla Armor Custom Helmet 11' },
  { id: 12, src: '/images/12.webp', alt: 'Gorilla Armor Custom Helmet 12'},
  { id: 13, src: '/images/13.webp',alt: 'Gorilla Armor Custom Helmet 13' },
  { id: 14, src: '/images/14.webp',alt: 'Gorilla Armor Custom Helmet 14' },
  { id: 15, src: '/images/15.webp',alt: 'Gorilla Armor Custom Helmet 15' },
  { id: 16, src: '/images/16.webp',alt: 'Gorilla Armor Custom Helmet 16' },
  { id: 17, src: '/images/17.webp',alt: 'Gorilla Armor Custom Helmet 17' },
  { id: 19, src: '/images/19.webp',alt: 'Gorilla Armor Custom Helmet 19' },
  { id: 21, src: '/images/20.webp',alt: 'Gorilla Armor Custom Helmet 21' },
  { id: 20, src: '/images/20.webp',alt: 'Gorilla Armor Custom Helmet 20' },
  
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Функция прокрутки карусели кнопками (для десктопа)
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <a href="#" className="logo" aria-label="Scroll to top">GORILLA ARMOR</a>
        
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
      {/* На мобилках px-0, на md: возвращаем отступы, чтобы картинки шли во весь экран */}
      <section id="gallery" className="py-20 px-0 md:px-8 bg-[#0b0b0b] relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          
          {/* Заголовок галереи с мобильными отступами по бокам */}
          <div className="text-center mb-12 px-4 md:px-0">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-white mb-2">
              Our Masterpieces
            </h2>
            <div className="h-1 w-20 bg-[#8b0000] mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-4 text-sm md:text-base">
              A showcase of custom forged armor, tailored for historical combat.
            </p>
          </div>

          {/* Интерактивная карусель */}
          <div className="relative group/carousel">
            
            {/* Стрелка Влево */}
            <button 
              onClick={() => scroll('left')}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-black/70 border border-[#2a2a2a] text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:border-[#ff4d4d] hover:text-[#ff4d4d]"
              aria-label="Previous slide"
            >
              ←
            </button>

            {/* Стрелка Вправо */}
            <button 
              onClick={() => scroll('right')}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-black/70 border border-[#2a2a2a] text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:border-[#ff4d4d] hover:text-[#ff4d4d]"
              aria-label="Next slide"
            >
              →
            </button>

            {/* Контейнер-лента слайдера */}
            <div 
              ref={scrollRef}
              className="flex w-full overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth gap-0 md:gap-6 pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`
                div::-webkit-scrollbar { display: none; }
              `}</style>

              {galleryImages.map((img) => (
  <div 
    key={img.id} 
    className="w-full min-w-full md:w-[calc(33.333%-16px)] md:min-w-[calc(33.333%-16px)] snap-start flex-shrink-0 group relative overflow-hidden bg-transparent transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,77,77,0.12)]"
  >
    {/* Контейнер картинки */}
    <div className="w-full h-auto pt-2 pb-6 px-2 bg-transparent flex items-center justify-center">
      <img 
        src={img.src} 
        alt={img.alt}
        className="w-full h-auto max-h-[450px] object-contain transition-transform duration-500 ease-out group-hover:scale-102"
        loading="lazy"
      />
    </div>

    {/* Скорректированный оверлей при наведении */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pb-6">
  <span className="text-xs md:text-sm uppercase tracking-widest text-[#ff4d4d] font-bold text-center md:text-left">
    Gorilla Armor Workshop
      </span>
    </div>
  </div>
))}
            </div>

          </div>

          {/* Подсказка для тач-скринов */}
          <div className="text-center md:hidden mt-2 text-xs text-gray-500 tracking-widest uppercase animate-pulse">
            ← Swipe to view masterpieces →
          </div>

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
        <Calculator /> 
      </section>

      {/* Footer */}
      <footer id="contacts" className="footer">
        <div className="footer-content">
          <p>GORILLA ARMOR | UKRAINE</p>
          
          <div className="footer-email-box">
            <a href="mailto:gorillaarmorshop@gmail.com" className="footer-email">
              gorillaarmorshop@gmail.com
            </a>
          </div>

          <div className="social-links">
            <a href="https://www.instagram.com/gorilla_armor_shop/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;