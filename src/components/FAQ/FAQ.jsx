// src/components/FAQ/FAQ.jsx
import React, { useState } from 'react';
import { FaPaw, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqItems = [
    {
      question: 'What are your adoption requirements?',
      answer: 'We require valid ID, proof of address, and a home visit to ensure a safe environment for the pet.'
    },
    {
      question: 'Can I return a pet if it doesn\'t work out?',
      answer: 'Yes, we offer a 30-day trial period and lifetime return policy for all adopted pets.'
    },
    {
      question: 'Do you offer pet training?',
      answer: 'Yes, we provide free basic training sessions for all adopted pets and can recommend advanced trainers.'
    },
    {
      question: 'Are all pets vaccinated?',
      answer: 'Yes, all pets receive age-appropriate vaccinations and are spayed/neutered before adoption.'
    },
    {
      question: 'Can I adopt if I live in an apartment?',
      answer: 'Yes, we help match pets with your living situation. Some pets are better suited for apartments than others.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="paww-prints-bg">
        {[...Array(8)].map((_, i) => (
          <FaPaw 
            key={i}
            className="floatingg-paw"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
              animationDelay: `${i * 0.2}s`,
              fontSize: `${Math.random() * 1 + 1}rem`,
              opacity: Math.random() * 0.2 + 0.1,
              color: '#b889e0'
            }}
          />
        ))}
      </div>
      
      <div className="faq-container">
        <motion.div 
          className="faq-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <img 
    src="/images/beagle.gif" 
    alt="" 
    className="deco-image top-left" 
  />
  <img 
    src="/images/bone.gif" 
    alt="" 
    className="deco-image top-right" 
  />
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about adopting your new best friend</p>
        </motion.div>

        <div className="faq-items">
          {faqItems.map((item, index) => (
            <motion.div 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleFAQ(index)}
              >
                <h3>{item.question}</h3>
                {activeIndex === index ? (
                  <FaChevronUp className="chevvron" />
                ) : (
                  <FaChevronDown className="chevvron" />
                )}
              </div>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;