// src/pages/Contact/Contact.jsx
import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  return (
    <main className="contact-page">
      <h1>Contact Us</h1>
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Have questions about adoption or want to visit our shelter? Reach out to us!</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>123 Pet Lane, Animal City, AC 12345</span>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>(555) 123-4567</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>info@pawshaven.com</span>
            </div>
            <div className="contact-item">
              <FaClock className="contact-icon" />
              <span>Mon-Fri: 9am-7pm, Weekends: 10am-5pm</span>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;