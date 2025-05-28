import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  FaPaw, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaUserCircle,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaComment,
  FaArrowLeft,
  FaSyringe,
  FaWeight,
  FaCut,
  FaNotesMedical,
  FaInfoCircle
} from 'react-icons/fa';
import PetImage from '../Profile/PetImage';
import FavoriteButton from '../Favorites/FavoriteButton';
import './PetDetail.css';

const PetDetail = () => {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [owner, setOwner] = useState(null);
    const [recommendedPets, setRecommendedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [showChatBox, setShowChatBox] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('about');

 
  useEffect(() => {
    const fetchPetData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            
            // Fetch pet details with owner info
            const petResponse = await axios.get(
                `http://localhost:8080/api/v1/pets/get/${id}`,
                config
            );
            
            setPet(petResponse.data);
            
            // Only fetch additional owner details if not already included
            if (petResponse.data.userId && !petResponse.data.ownerProfileImage) {
                const ownerResponse = await axios.get(
                    `http://localhost:8080/api/v1/auth/${petResponse.data.userId}`,
                    config
                );
                setPet(prev => ({
                    ...prev,
                    ownerName: ownerResponse.data.name,
                    ownerProfileImage: ownerResponse.data.profileImage
                }));
            }
            
            // Fetch recommended pets
            if (petResponse.data.specie) {
                const recommendedResponse = await axios.get(
                    `http://localhost:8080/api/v1/pets/recommended?specie=${petResponse.data.specie}&exclude=${id}`,
                    config
                );
                setRecommendedPets(recommendedResponse.data);
            }
            
            setLoading(false);
        } catch (err) {
            console.error('Error fetching pet data:', err);
            setError('Failed to load pet details. Please try again later.');
            setLoading(false);
        }
    };

    fetchPetData();
}, [id]);


  const handleSendMessage = () => {
    // Implement chat functionality
    console.log('Message sent:', message);
    setMessage('');
    setShowChatBox(false);
    // Here you would typically send the message to your backend
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically update the like status in your backend
  };

   // Auto-generate about text based on pet details
   const generateAboutText = () => {
    const parts = [];
    
    if (pet.specie && pet.breed) {
      parts.push(`${pet.petName} is a ${pet.age ? pet.age + ' old ' : ''}${pet.breed} ${pet.specie}.`);
    }

    if (pet.gender) {
      parts.push(`${pet.petName} is ${pet.gender === 'Male' ? 'a male' : 'a female'}.`);
    }

    if (pet.size) {
      parts.push(`This ${pet.specie || 'pet'} is ${pet.size.toLowerCase()} sized.`);
    }

    if (pet.colorMarkings) {
      parts.push(`They have beautiful ${pet.colorMarkings}.`);
    }

    if (pet.behavior) {
      parts.push(`In terms of personality, ${pet.petName} is ${pet.behavior.toLowerCase()}.`);
    }

    return parts.length > 0 
      ? parts.join(' ') 
      : `Meet ${pet.petName}, a wonderful ${pet.specie || 'pet'} looking for a new home.`;
  };


  if (loading) {
    return (
      <div className="pet-detail-loading">
        <div className="pet-detail-spinner"></div>
        <p>Loading pet details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pet-detail-error">
        <p>{error}</p>
        <Link to="/pets" className="pet-detail-back-btn">
          <FaArrowLeft /> Back to Pets
        </Link>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="pet-detail-not-found">
        <h2>Pet not found</h2>
        <Link to="/pets" className="pet-detail-back-btn">
          <FaArrowLeft /> Back to Pets
        </Link>
      </div>
    );
  }

  return (
    <div className="pet-detail-container">
      <div className="pet-detail-gradient-bg">

        <div className="pet-detail-main">
          <div className="pet-detail-gallery">
            <div className="pet-detail-main-image highlight reflection">
              <PetImage pet={pet} />
            </div>
          </div>

          <div className="pet-detail-info">
            <div className="pet-detail-header">
              <h1 className="pet-detail-name">{pet.petName}</h1>
              <div className="pet-detail-actions">
                <FavoriteButton petId={pet.id} />
                <button className="pet-detail-share-btn">
                  <FaShare />
                </button>
              </div>
            </div>

          <div className="pet-detail-meta">
            <span className="pet-detail-specie">{pet.specie}</span>
            <span className="pet-detail-breed">{pet.breed}</span>
            <span className="pet-detail-age">{pet.age}</span>
            <span className="pet-detail-gender">{pet.gender}</span>
            <span className="pet-detail-size">{pet.size}</span>
          </div>

          <div className="pet-detail-location">
            <FaMapMarkerAlt className="pet-detail-location-icon" />
            <span>{pet.location}</span>
          </div>

          {/* New: Quick Facts Section */}
          <div className="pet-detail-quick-facts">
            <div className="quick-fact">
              <FaSyringe />
              <span>Vaccination: <br></br> {pet.vaccinationStatus || 'Unknown'}</span>
            </div>
            <div className="quick-fact">
              <FaCut />
              <span>Spayed/Neutered: <br></br> {pet.spayedNeutered ? 'Yes' : 'No'}</span>
            </div>
            {pet.adoptionFeeFree ? (
              <div className="quick-fact">
                <FaHeart /><span>Adoption Fee: <br></br> Free</span>
              </div>
            ) : (
              <div className="quick-fact">
                <FaHeart />
                <span>Adoption Fee: Rs.{pet.adoptionFee || 'Negotiable'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
        {/* New: Tab Navigation */}
        <div className="full-width-content">
          <div className="pet-detail-tabs">
            <button 
              className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button 
              className={`tab-button ${activeTab === 'health' ? 'active' : ''}`}
              onClick={() => setActiveTab('health')}
            >
              Health
            </button>
            <button 
              className={`tab-button ${activeTab === 'behavior' ? 'active' : ''}`}
              onClick={() => setActiveTab('behavior')}
            >
              Behavior
            </button>
          </div>

          {/* Tab Content */}
            <div className="pet-detail-tab-content">
            {activeTab === 'about' && (
              <>
                <div className="pet-detail-section">
                  <h3 className="pet-detail-section-title">
                    <FaInfoCircle /> About {pet.petName}
                  </h3>
                  <p className="pet-detail-description">{generateAboutText()}</p>
                  
                  <div className="pet-detail-features">
                    <div className="pd-feature">
                      <span className="pd-feature-label">Breed:</span>
                      <span>{pet.breed || 'Mixed breed'}</span>
                    </div>
                    <div className="pd-feature">
                      <span className="pd-feature-label">Age:</span>
                      <span>{pet.age || 'Unknown'}</span>
                    </div>
                    <div className="pd-feature">
                      <span className="pd-feature-label">Gender:</span>
                      <span>{pet.gender || 'Unknown'}</span>
                    </div>
                    {pet.colorMarkings && (
                      <div className="pd-feature">
                        <span className="pd-feature-label">Color/Markings:</span>
                        <span>{pet.colorMarkings}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pet-detail-section">
                  <h3 className="pet-detail-section-title">
                    <FaHeart /> Adoption Information
                  </h3>
                  <p className="pet-detail-description">
                    <strong>Reason for adoption:</strong> {pet.justify || 'Not specified'}
                  </p>
                  {pet.ifTemp && pet.reason === 'Temporary' && (
                    <p className="pet-detail-description">
                      <strong>Temporary duration:</strong> {pet.ifTemp}
                    </p>
                  )}
                </div>
              </>
            )}

            {activeTab === 'health' && (
              <div className="pet-detail-section">
                <h3 className="pet-detail-section-title">
                  <FaNotesMedical /> Health Information
                </h3>
                <div className="pet-detail-features">
                  <div className="pd-feature">
                    <span className="pd-feature-label">Vaccination Status:  </span> 
                    <span>{pet.vaccinationStatus || 'Unknown'}</span>
                  </div>
                  <div className="pd-feature">
                    <span className="pd-feature-label">Spayed/Neutered:</span>
                    <span>{pet.spayedNeutered ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="pd-feature">
                    <span className="pd-feature-label">Medical History:</span>
                    <span>{pet.medicalHistory || 'No significant medical history'}</span>
                  </div>
                  <div className="pd-feature">
                    <span className="pd-feature-label">Special Needs:</span>
                    <span>{pet.specialNeeds || 'None reported'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'behavior' && (
              <div className="pet-detail-section">
                <h3 className="pet-detail-section-title">
                  <FaPaw /> Behavior & Personality
                </h3>
                <div className="pet-detail-features">
                  <div className="pd-feature">
                    <span className="pd-feature-label">Temperament:</span>
                    <span>{pet.behavior || 'Not specified'}</span>
                  </div>
                
                
                </div>
              </div>
            )}
          </div>

          {/* Owner Information */}
          <div className="pet-detail-section">
            <h3 className="pet-detail-section-title">Owner Information</h3>
            <div className="pet-detail-owner">
              {pet.ownerProfileImage ? (
                <img 
                  src={pet.ownerProfileImage.startsWith('http') ? pet.ownerProfileImage : `http://localhost:8080${pet.ownerProfileImage}`}
                  alt={pet.ownerName || 'Pet owner'}
                  className="pet-detail-owner-avatar"
                  onError={(e) => {
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/10542/10542486.png';
                  }}
                />
                ) : (
                <FaUserCircle className="pet-detail-owner-avatar" />
              )}
              <div className="pet-detail-owner-info">
                <h4 className="pet-detail-owner-name">
                  {pet.ownerName || 'Unknown Owner'}
                </h4>
                <div className="pet-detail-contact">
                  <a href={`mailto:${pet.contactEmail}`} className="pet-detail-contact-link">
                    <FaEnvelope /> {pet.contactEmail}
                  </a>
                  <a href={`tel:${pet.contactPhoneNumber}`} className="pet-detail-contact-link">
                    <FaPhone /> {pet.contactPhoneNumber}
                  </a>
                </div>
              </div>
          </div>
        

            <button 
              className="pet-detail-chat-btn"
              onClick={() => setShowChatBox(true)}
              >
              <FaComment /> Message Owner
            </button>
          </div>
        </div>
     
          
        {recommendedPets.length > 0 && (
          <div className="pet-detail-recommended ">
            <h2 className="pet-detail-recommended-title">Other {pet.specie}s you might like</h2>
            <div className="pet-detail-recommended-grid">
              {recommendedPets.map(recommendedPet => (
                <div key={recommendedPet.id} className="plp-pet-card">
                  <div className="plp-pet-image-wrapper">
                    <Link to={`/petDetail/${recommendedPet.id}`} className="plp-pet-card-link">
                      <div className="plp-pet-image-container">
                        <PetImage pet={recommendedPet} />
                        <div className={`plp-pet-status ${recommendedPet.isAvailable ? 'available' : 'adopted'}`}>
                          {recommendedPet.isAvailable ? 'Available' : 'Adopted'}
                        </div>
                      </div>
                    </Link>
                    <div className="plp-favorite-button-container">
                      <FavoriteButton petId={recommendedPet.id} />
                    </div>
                  </div>
                  <div className="plp-pet-info">
                    <div className="plp-pet-info-header">
                    
                      <h3>{recommendedPet.petName}</h3>
                      <div className="plp-pet-meta">
                        <span className="plp-pet-gender">{recommendedPet.gender}</span>
                      </div>
                    </div>
                    <div className="plp-pet-details">
                      <p className="plp-pet-breed">
                        {recommendedPet.breed}
                      </p>
                      <div className="plp-pet-location">
                        <FaMapMarkerAlt className="plp-location-icon" /> 
                        <span>{recommendedPet.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

              {showChatBox && (
                <div className="pet-detail-chatbox">
                  <div className="pet-detail-chatbox-header">
                    <h3>Message {owner?.name || 'the owner'}</h3>
                    <button 
                      className="pet-detail-chatbox-close"
                      onClick={() => setShowChatBox(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="pet-detail-chatbox-body">
                    <textarea
                      placeholder={`Hi, I'm interested in ${pet.petName}. Can you tell me more?`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="pet-detail-chatbox-footer">
                    <button 
                      className="pet-detail-chatbox-send"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
      
};

export default PetDetail;