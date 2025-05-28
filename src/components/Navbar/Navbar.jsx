import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaUserPlus, FaUserCircle, FaHeart } from 'react-icons/fa'; // Added FaHeart
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
     
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav 
      ref={navbarRef}
      className={`navbar ${scrolled ? 'scrolled' : ''} ${visible ? 'visible' : 'hidden'}`}
    >
      <div className="navbar-container">
        <Link to="/" className="logo">
          <FaPaw className="paw-icon" />
          <h1>Paws Haven</h1>
        </Link>

        <div className="nav-center">
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li><Link to="/petlist" onClick={() => setMobileMenuOpen(false)}>Browse pets</Link></li>
            <li><Link to="/form" onClick={() => setMobileMenuOpen(false)}>Add New Pet</Link></li>
            <li><Link to="/map" onClick={() => setMobileMenuOpen(false)}>Map</Link></li>
            <li><Link to="/faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link></li>
            <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
          </ul>
        </div>

        <div className="nav-right">
          <button 
            className="favorites-btn" 
            onClick={() => navigate('/favorites')}
            aria-label="Favorites"
          >
            <FaHeart className="heart-icon" />
          </button>
          <button className="profile-btn" onClick={() => navigate('/profile')} >
            Profile<FaUserCircle className="profile-icon" />
          </button>
        </div>

        <div 
          className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;