import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPaw, FaUserPlus, FaUserCircle, FaHeart } from 'react-icons/fa';
import PetCat from '../../assets/advice.png';
import Dogs from '../../assets/d1.png';
import Cats from '../../assets/c1.png';
import Rabbits from '../../assets/r1.png';
import Birds from '../../assets/b1.png';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const navbarRef = useRef(null);

  const isHomePage = location.pathname === '/';
  const homeNotScrolled = isHomePage && !scrolled;

  const navigateToPetList = (filterValue) => {
    navigate('/petlist', { state: { initialFilter: filterValue } });
    setMobileMenuOpen(false);
  };

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav 
      ref={navbarRef}
      className={`navbar ${scrolled ? 'scrolled' : ''} ${visible ? 'visible' : 'hidden'} ${
        isHomePage ? 'home-navbar' : 'other-navbar'
      } ${homeNotScrolled ? 'home-not-scrolled' : ''} ${
        mobileMenuOpen ? 'mobile-menu-open' : ''
      }`}
    >
      <div className="navbar-container">
        <Link to="/" className={`logo ${homeNotScrolled ? 'home-logo' : ''}`}>
          <FaPaw className={`paw-icon ${homeNotScrolled ? 'home-paw-icon' : ''}`} />
          <h1>Paws Haven</h1>
        </Link>

        
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li className="nav-item-with-dropdown">
              <Link to="/petlist" className={homeNotScrolled ? 'home-nav-link' : ''} onClick={() => setMobileMenuOpen(false)}>
                Browse pets
              </Link>
              
              <div className="dropdown-fullwidth-wrapper">
               <div className="dropdown-fullwidth">
                <div className="dropdown-container">
                  <div className="dropdown-content">
                    {/* Left Section - Introduction Panel */}
                    <div className="dropdown-intro">
                      <h3>Find Your Perfect Pet</h3>
                      <p>Browse our selection of adorable pets waiting for their forever homes</p>
                      <div className="dropdown-image">
                        <img src={PetCat} className="intro-paw" /> 
                      </div>
                    </div>
                    
                    {/* Right Section - Pet Categories Grid */}
                    <div className="Dpet-categories-grid">
                      <Link  to="/petlist" state={{ initialFilter: "Dog" }} className="Dpet-category-card dog" onClick={() => setMobileMenuOpen(false)}>
                        <div className="Dpet-icon-container">
                           <img src={Dogs} className="Dpet-icon" />
                            <span>Dogs</span>
                        </div>
                       
                      </Link>
                      
                      <Link to="/petlist" state={{ initialFilter: "Cat" }} className="Dpet-category-card cat" onClick={() => setMobileMenuOpen(false)}>
                        <div className="Dpet-icon-container">
                           <img src={Cats} className="Dpet-icon" />
                           <span>Cats</span>
                        </div>
                        
                      </Link>
                      
                      <Link to="/petlist" state={{ initialFilter: "Rabbit" }} className="Dpet-category-card rabbit" onClick={() => setMobileMenuOpen(false)}>
                        <div className="Dpet-icon-container">
                           <img src={Rabbits} className="Dpet-icon" />
                           <span>Rabbits</span>
                        </div>
                        
                      </Link>
                      
                      <Link to="/petlist" state={{ initialFilter: "Bird" }} className="Dpet-category-card bird" onClick={() => setMobileMenuOpen(false)}>
                        <div className="Dpet-icon-container">
                           <img src={Birds} className="Dpet-icon" />
                           <span>Birds</span>
                        </div>
                        
                      </Link>
                    </div>
                  </div>
                </div>
            </div>
            </div>
            </li>
            <li><Link to="/form" className={homeNotScrolled ? 'home-nav-link' : ''} onClick={() => setMobileMenuOpen(false)}>Add New Pet</Link></li>
            <li><Link to="/map" className={homeNotScrolled ? 'home-nav-link' : ''} onClick={() => setMobileMenuOpen(false)}>Find Vet</Link></li>

            <li><Link to="/contact" className={homeNotScrolled ? 'home-nav-link' : ''} onClick={() => setMobileMenuOpen(false)}>Contact Us</Link></li>
          </ul>
        

        <div className="nav-right">
          <button 
            className={`favorites-btn ${homeNotScrolled ? 'home-favorites-btn' : ''}`} 
            onClick={() => {
              navigate('/favorites');
              setMobileMenuOpen(false);
            }}
            aria-label="Favorites"
          >
            <FaHeart className="heart-icon" />
          </button>
          <button 
            className={`profile-btn ${homeNotScrolled ? 'home-profile-btn' : ''}`} 
            onClick={() => {
              navigate('/profile');
              setMobileMenuOpen(false);
            }}
          >
            Profile<FaUserCircle className="profile-icon" />
          </button>
        </div>

        <div 
          className={`hamburger ${mobileMenuOpen ? 'open' : ''} ${homeNotScrolled ? 'home-hamburger' : ''}`}
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