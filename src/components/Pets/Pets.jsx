import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPaw, FaArrowRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import PetImage from '../../pages/Profile/PetImage';
import FavoriteButton from '../../pages/Favorites/FavoriteButton';
import './Pets.css';
import '../PetCategory/PetCategory.css'; // Assuming you have a CSS file for styling
const Pets = () => {
    const [recentPets, setRecentPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentPets = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/v1/pets/recent-approved', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRecentPets(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching recent pets:', err);
                setError('Failed to load recent pets. Please try again later.');
                setIsLoading(false);
            }
        };
    
        fetchRecentPets();
    }, []);

    if (isLoading) {
        return (
            <div className="recent-pets-loading">
                <div className="loading-spinner"></div>
                <p>Loading recent pets...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recent-pets-error">
                <p>{error}</p>
            </div>
        );
    }
   
    return (
        <section className="recent-pets-section">
            {/* Add the paw prints background */}
            <div className="paw-prints-background">
                {[...Array(15)].map((_, i) => (
                    <FaPaw 
                        key={i}
                        className="floating-paw"
                        style={{
                            left: `${Math.random() * 100 + 5}%`,
                            top: `${Math.random() * 100 + 5}%`,
                            animationDelay: `${i * 0.2}s`,
                            fontSize: `${Math.random() * 1.7 + 1}rem`,
                            opacity: Math.random() * 0.3 + 0.1,
                        }}
                    />
                ))}
            </div>
            
            <div className="recent-pets-header">
                <h2>Recently Added Pets</h2>
                <p>Meet our newest furry friends looking for homes</p>
            </div>

            <div className="recent-pets-grid">
                {recentPets.length > 0 ? (
                    recentPets.map(pet => (
                        <div key={pet.id} className="recent-pet-card">
                            <div className="recent-pet-image-wrapper">
                                <Link to={`/petDetail/${pet.id}`} className="recent-pet-card-link">
                                    <div className="recent-pet-image-container">
                                    <PetImage pet={pet} />
                                    </div>
                                </Link>
                                <div className="favorite-button-container">
                                    <FavoriteButton petId={pet.id} />
                                </div>
                            </div>
                            <div className="recent-pet-info">
                                <div className="pet-info-header">
                                    <h3>{pet.petName}</h3>
                                    <span className="pet-gender">{pet.gender}</span>
                                </div>
                                <div className="pet-details">
                                    <p className="recent-pet-breed">
                                        {pet.breed}
                                    </p>        
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="recent-no-pets-message">
                        <p>No recently added pets available at the moment.</p>
                    </div>
                )}
            </div>

            <div className="recent-view-more-container">
                <Link to="/petlist" className="recent-view-more-btn hero-button">
                    View More Pets <FaArrowRight className="hero-button-arrow" />
                </Link>
            </div>
        </section>
    );
};

export default Pets;