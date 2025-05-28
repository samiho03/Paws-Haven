import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaHeart, FaDog, FaCat, FaArrowRight, FaPlusCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Button from "../ui/button";
import './Hero.css';


const Hero = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  // Floating pet animation variants
  const floatingPets = [
    { icon: <FaDog />, size: '2rem', delay: 0, duration: 8 },
    { icon: <FaCat />, size: '1.8rem', delay: 1, duration: 10 },
    { icon: <FaHeart />, size: '1.5rem', delay: 2, duration: 12 },
  ];

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  // Button animation variants
  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 8px 20px rgba(154, 107, 255, 0.4)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

   const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate('/form'); // Navigate to pet posting form
    } else {
      navigate('/signup'); // Navigate to signup page
    }
  };
  
  return (
    
    <section className="hero" id="home">
      <div className="hero-overlay"></div>
      
      {/* Floating animated pets */}
      {floatingPets.map((pet, index) => (
        <motion.div
          key={index}
          className="floating-pet"
          initial={{ y: 0, x: Math.random() * 100 }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 35, 0]
          }}
          transition={{
            duration: pet.duration,
            delay: pet.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            fontSize: pet.size,
            color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2})`,
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`
          }}
        >
          {pet.icon}
        </motion.div>
      ))}
 
      <div className="hero-content">
    
        {/* Decorative corner images */}
        <img 
          src="/images/bone1.png" 
          alt="" 
          className="decorative-image top-left" 
        />
        <img 
          src="/images/paws1.png" 
          alt="" 
          className="decorative-image top-right" 
        />

        <h1 className="hero-title">
        Snag Your Dream Pet Here

        </h1>

        <img 
          src="/images/beaglee.png" 
          alt="" 
          className="decorative-image bottom-left" 
        />
        <img 
          src="/images/orangiee.png" 
          alt="" 
          className="decorative-image bottom-right" 
        />
  
        <p className="hero-description">
          Changing lives, one adoption at a time. Meet your new best friend today.
        </p>
        <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          className="hero-button"
          onClick={handleButtonClick} 
        >
          {isLoggedIn ? (
            <>
              Post Your Pet <FaPlusCircle className="hero-button-icon" /> 
            </>
          ) : (
            <>
              Get Started Now<FaArrowRight className="hero-button-icon hero-button-arrow" /> 
            </>
          )}
        </Button>
      </motion.div>

      
      <div className="hero-images">   
        <div className="clouds-container">
          <img src="/images/clouds1.png" alt="Cloud Background" className="cloud-image" />
          <img src="/images/shitzu-girl.png" alt="Shih Tzu Dog" className="dog-image" />
        </div>
      </div>
      
    
        {/* Paw prints background */}
        <div className="paw-prints">
          {[...Array(20)].map((_, i) => (
            <FaPaw 
              key={i} 
              className="paw-print" 
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 85 + 5}%`,
                animationDelay: `${i * 0.2}s`,
                fontSize: `${Math.random() * 1.7 + 1}rem`,
                opacity: Math.random() * 0.3 + 0.1
              }} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;