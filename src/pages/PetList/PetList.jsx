import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaPaw, FaMapMarkerAlt, FaTimes, FaUserPlus, FaHeart , FaCat} from 'react-icons/fa';
import { GiRabbit, GiParrotHead } from 'react-icons/gi';
import { IoMdPaw } from 'react-icons/io';
import PetImage from '../Profile/PetImage';
import FavoriteButton from '../Favorites/FavoriteButton';
import './PetList.css';

const PetList = () => {
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        specie: '',
        breed: '',
        gender: '',
        location: '',
        size: '',
        vaccinationStatus: '',
        spayedNeutered: '',
        adoptionFee: '',
        search: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Sri Lankan districts
    const districts = [
        'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale',
        'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna',
        'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa',
        'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura',
        'Polonnaruwa', 'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                
                if (!token) {
                    setLoading(false);
                    return;
                }
                
                const response = await axios.get('http://localhost:8080/api/v1/pets/approved', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const sortedPets = [...response.data].sort((a, b) => b.id - a.id);
                setPets(sortedPets);
                setFilteredPets(sortedPets);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching pets:', err);
                setError('Failed to load pets. Please try again later.');
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchPets();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const filtered = pets.filter(pet => {
            const safeToLower = (value) => (value || '').toString().toLowerCase();

            const matchesSearch = filters.search === '' || 
                pet.petName.toLowerCase().includes(filters.search.toLowerCase()) ||
                pet.breed.toLowerCase().includes(filters.search.toLowerCase()) ||
                pet.location.toLowerCase().includes(filters.search.toLowerCase());

            const matchesSpecie = filters.specie === '' || 
                pet.specie.toLowerCase() === filters.specie.toLowerCase();

            const matchesBreed = filters.breed === '' || 
                pet.breed.toLowerCase().includes(filters.breed.toLowerCase());

            const matchesGender = filters.gender === '' || 
                pet.gender.toLowerCase() === filters.gender.toLowerCase();

            const matchesLocation = filters.location === '' || 
                pet.location.toLowerCase() === filters.location.toLowerCase();

            const matchesSize = filters.size === '' || 
                pet.size?.toLowerCase() === filters.size.toLowerCase();

            const matchesVaccination = filters.vaccinationStatus === '' || 
                pet.vaccinationStatus?.toLowerCase() === filters.vaccinationStatus.toLowerCase();

            const matchesSpayedNeutered = filters.spayedNeutered === '' || 
                (filters.spayedNeutered === 'yes' && pet.spayedNeutered) || 
                (filters.spayedNeutered === 'no' && !pet.spayedNeutered);

            const matchesAdoptionFee = filters.adoptionFee === '' || 
                (filters.adoptionFee === 'free' && pet.adoptionFeeFree) ||
                (filters.adoptionFee === 'paid' && !pet.adoptionFeeFree);

            return matchesSearch && matchesSpecie && matchesBreed && 
                   matchesGender && matchesLocation && matchesSize &&
                   matchesVaccination && matchesSpayedNeutered && matchesAdoptionFee;
        });

        setFilteredPets(filtered);
    }, [filters, pets]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const resetFilters = () => {
        setFilters({
            specie: '',
            breed: '',
            gender: '',
            location: '',
            size: '',
            vaccinationStatus: '',
            spayedNeutered: '',
            adoptionFee: '',
            search: ''
        });
    };

    const activeFilterCount = Object.values(filters).filter(val => val !== '').length;

    const getSpecieIcon = (specie) => {
        switch(specie.toLowerCase()) {
            case 'dog': return <IoMdPaw className="plp-specie-icon" />;
            case 'cat': return <FaCat className="plp-specie-icon" />;
            case 'rabbit': return <GiRabbit className="plp-specie-icon" />;
            case 'bird': return <GiParrotHead className="plp-specie-icon" />;
            default: return <FaPaw className="plp-specie-icon" />;
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="plp-container">
                <div className="plp-hero">
                    <div className="plp-hero-content">
                        <h1 className="plp-hero-title">
                            <span className="plp-hero-highlight">Find Your</span> Perfect Furry Companion
                        </h1>
                        <p className="plp-hero-subtitle">Join thousands of happy pets and owners in our loving community</p>
                        <div className="plp-hero-cta">
                            <button 
                                className="plp-cta-button plp-primary-btn"
                                onClick={() => navigate('/signup')}
                            >
                                <FaUserPlus /> Join Now
                            </button>
                            <button 
                                className="plp-cta-button plp-secondary-btn"
                                onClick={() => navigate('/login')}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                    <div className="plp-hero-image"></div>
                </div>

                <div className="plp-guest-message">
                    <div className="plp-guest-content">
                        <div className="plp-features">
                            <div className="plp-feature-card">
                                <div className="plp-feature-icon plp-purple-bg">
                                    <FaPaw />
                                </div>
                                <h3>Browse Pets</h3>
                                <p>Discover pets waiting for their forever homes in your area</p>
                            </div>
                            <div className="plp-feature-card">
                                <div className="plp-feature-icon plp-purple-bg">
                                    <FaHeart />
                                </div>
                                <h3>Save Favorites</h3>
                                <p>Keep track of pets you're interested in with our favorites system</p>
                            </div>
                            <div className="plp-feature-card">
                                <div className="plp-feature-icon plp-purple-bg">
                                    <FaMapMarkerAlt />
                                </div>
                                <h3>Local Matches</h3>
                                <p>Find pets near you with our location-based search</p>
                            </div>
                        </div>

                        <div className="plp-testimonials">
                            <h2>Success Stories</h2>
                            <div className="plp-testimonial-slider">
                                <div className="plp-testimonial">
                                    <div className="plp-testimonial-content">
                                        "We found our perfect match with Luna. The adoption process was smooth and the team was incredibly helpful!"
                                    </div>
                                    <div className="plp-testimonial-author">- The Silva Family, Colombo</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="plp-container">
            <div className="plp-header">
                <h1 className="plp-title">
                    <span className="plp-title-highlight">Available</span> Pets
                </h1>
                <p className="plp-subtitle">Find your perfect companion from our loving pets</p>
            </div>

            <div className="plp-search-filter-container">
                <div className="plp-search-box">
                    <FaSearch className="plp-search-icon" />
                    <input
                        type="text"
                        className="plp-search-input"
                        placeholder="Search by name, breed or location..."
                        value={filters.search}
                        onChange={handleSearchChange}
                    />
                    {filters.search && (
                        <button 
                            className="plp-clear-search"
                            onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>
                
                <button 
                    className={`plp-filter-toggle-btn ${activeFilterCount > 0 ? 'plp-has-filters' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <FaFilter className="plp-filter-icon" /> 
                    {showFilters ? 'Hide Filters' : 'Filters'}
                    {activeFilterCount > 0 && (
                        <span className="plp-filter-count">{activeFilterCount}</span>
                    )}
                </button>
            </div>

            {showFilters && (
                <div className="plp-filter-panel">
                    <div className="plp-filter-section">
                        <h3 className="plp-section-title">Basic Info</h3>
                        <div className="plp-filter-grid">
                            <div className="plp-filter-group">
                                <label className="plp-filter-label">Species</label>
                                <select 
                                    name="specie" 
                                    className="plp-filter-select"
                                    value={filters.specie}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Species</option>
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Bird">Bird</option>
                                    <option value="Rabbit">Rabbit</option>
                                </select>
                            </div>

                            <div className="plp-filter-group">
                                <label className="plp-filter-label">Breed</label>
                                <input
                                    type="text"
                                    name="breed"
                                    className="plp-filter-input"
                                    placeholder="Any breed"
                                    value={filters.breed}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="plp-filter-group">
                                <label className="plp-filter-label">Gender</label>
                                <select 
                                    name="gender" 
                                    className="plp-filter-select"
                                    value={filters.gender}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Any Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="plp-filter-section">
                        <h3 className="plp-section-title">Location & Details</h3>
                        <div className="plp-filter-grid">
                            <div className="plp-filter-group">
                                <label className="plp-filter-label">Location</label>
                                <select 
                                    name="location" 
                                    className="plp-filter-select"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Locations</option>
                                    {districts.map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="plp-filter-group">
                                <label className="plp-filter-label">Size</label>
                                <select 
                                    name="size" 
                                    className="plp-filter-select"
                                    value={filters.size}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Any Size</option>
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                </select>
                            </div>

                            <div className="plp-filter-group">
                                <label className="plp-filter-label">Age</label>
                                <select 
                                    name="age" 
                                    className="plp-filter-select"
                                    value={filters.age}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Any Age</option>
                                    <option value="Puppy/Kitten">Puppy/Kitten</option>
                                    <option value="Young">Young</option>
                                    <option value="Adult">Adult</option>
                                    <option value="Senior">Senior</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="plp-filter-section">
                        <h3 className="plp-section-title">Health & Adoption</h3>
                        <div className="plp-filter-grid">
                            <div className="plp-filter-group">
                                <label className="plp-filter-label">Vaccination</label>
                                <select 
                                    name="vaccinationStatus" 
                                    className="plp-filter-select"
                                    value={filters.vaccinationStatus}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Any Status</option>
                                    <option value="Up-to-date">Up-to-date</option>
                                    <option value="Not vaccinated">Not vaccinated</option>
                                </select>
                            </div>

                            <div className="plp-filter-group">
                                <label className="plp-filter-label">Spayed/Neutered</label>
                                <select 
                                    name="spayedNeutered" 
                                    className="plp-filter-select"
                                    value={filters.spayedNeutered}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Any</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>

                            <div className="plp-filter-group">
                                <label className="plp-filter-label">Adoption Fee</label>
                                <select 
                                    name="adoptionFee" 
                                    className="plp-filter-select"
                                    value={filters.adoptionFee}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Any</option>
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="plp-filter-actions">
                        <button 
                            className="plp-reset-filters-btn"
                            onClick={resetFilters}
                            disabled={activeFilterCount === 0}
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="plp-loading-state">
                    <div className="plp-loading-spinner"></div>
                    <p>Finding your perfect pets...</p>
                </div>
            ) : error ? (
                <div className="plp-error-state">
                    <div className="plp-error-icon">⚠️</div>
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button 
                        className="plp-retry-btn"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="plp-grid">
                    {filteredPets.length > 0 ? (
                        filteredPets.map(pet => (
                            <div key={pet.id} className="plp-card">
                                <div className="plp-card-header">
                                    <FavoriteButton petId={pet.id} />
                                    <div className={`plp-status-badge ${pet.isAvailable ? 'plp-available' : 'plp-adopted'}`}>
                                        {pet.isAvailable ? 'Available' : 'Adopted'}
                                    </div>
                                </div>
                                <Link to={`/petDetail/${pet.id}`} className="plp-card-link">
                                    <div className="plp-image-container">
                                        <PetImage pet={pet} className="plp-image" />
                                    </div>
                                    <div className="plp-info">
                                        <div className="plp-name-row">
                                            {getSpecieIcon(pet.specie)}
                                            <h3 className="plp-name">{pet.petName}</h3>
                                        </div>
                                        <p className="plp-breed">{pet.breed}</p>
                                        <div className="plp-meta">
                                            <span className="plp-gender">{pet.gender}</span>
                                            <span className="plp-age">{pet.age}</span>
                                        </div>
                                        <div className="plp-location">
                                            <FaMapMarkerAlt className="plp-location-icon" /> 
                                            <span>{pet.location}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="plp-empty-state">
                            <div className="plp-empty-icon">
                                <FaPaw />
                            </div>
                            <h3>No pets found matching your criteria</h3>
                            <p>Try adjusting your filters or search term</p>
                            <button 
                                className="plp-reset-btn plp-purple-bg"
                                onClick={resetFilters}
                            >
                                Reset all filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PetList;