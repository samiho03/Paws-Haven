import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPaw, FaArrowRight } from 'react-icons/fa';
import PetImage from '../../pages/Profile/PetImage';
import './Pets.css';

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
                    // If not logged in, don't even try to fetch
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
            <div className="recent-pets-header">
                <h2>
                    <FaPaw className="paw-icon" /> Recently Added Pets
                </h2>
                <p>Meet our newest furry friends looking for homes</p>
            </div>

            <div className="recent-pets-grid">
                {recentPets.length > 0 ? (
                    recentPets.map(pet => (
                        <div key={pet.id} className="recent-pet-card">
                            <Link to={`/petDetail/${pet.id}`} className="recent-pet-card-link">
                                <div className="recent-pet-image-container">
                                    <PetImage pet={pet} />
                                </div>
                                <div className="recent-pet-info">
                                    <h3>{pet.petName}</h3>
                                    <p className="recent-pet-breed">{pet.breed}</p>
                                    <p className="recent-pet-age">{pet.age}</p>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="recent-no-pets-message">
                        <p>No recently added pets available at the moment.</p>
                    </div>
                )}
            </div>

            <div className="recent-view-more-container">
                <Link to="/petlist" className="recent-view-more-btn">
                    View More Pets <FaArrowRight className="arrow-icon" />
                </Link>
            </div>
        </section>
    );
};

export default Pets;