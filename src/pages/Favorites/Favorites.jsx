// FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {   FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import PetImage from '../Profile/PetImage';
import './Favorites.css';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('User not authenticated');
                }

                const response = await axios.get(
                    'http://localhost:8080/api/v1/favorites',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setFavorites(response.data);
            } catch (err) {
                console.error('Error fetching favorites:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) {
        return <div className="loading">Loading your favorites...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <Link to="/login">Please login to view favorites</Link>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <h1>Your Favorite Pets</h1>
            
            {favorites.length === 0 ? (
                <div className="no-favorites">
                    <p>You haven't favorited any pets yet.</p>
                    <Link to="/pets" className="browse-link">
                        Browse available pets
                    </Link>
                </div>
            ) : (
                <div className="favorites-grid">
                    {favorites.map(pet => (
                        <div key={pet.id} className="favorite-card">
                            <Link to={`/petDetail/${pet.id}`}>
                                <div className="favorite-image">
                                    <PetImage pet={pet} />
                                </div>
                                <div className="favorite-info">
                                    <h3>{pet.petName}</h3>
                                    <p>{pet.breed} • {pet.age}</p>
                                    <p><FaMapMarkerAlt /> {pet.location}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;