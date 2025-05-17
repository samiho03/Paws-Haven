import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCamera, FaHeart, FaPaw, FaUserPlus, FaLock} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig'; 
import './UserForm.css';



const UserForm = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    petName: '',
    specie: '',
    breed: '',
    location: '',
    age: '',
    gender: '',
    reason: '',
    ifTemp: '',
    justify: '',
    ownerName: '',
    nic: '',
    contactEmail: '',
    contactPhoneNumber: '',
    vaccinationStatus: '',
    colorMarkings: '',
    size: '',
    spayedNeutered: false,
    medicalHistory: '',
    behavior: '',
    specialNeeds: '',
    adoptionFee: 0,
    adoptionFeeFree: false,
  });
  const [photoFile, setPhotoFile] = useState(null); // Store the actual file
  const [photoPreview, setPhotoPreview] = useState(null); // For preview only
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axiosInstance.get('/auth/me');
          setUserData(response.data);
          setFormData(prev => ({
            ...prev,
            contactEmail: response.data.email,
            contactPhoneNumber: response.data.phone,
            location: response.data.location,
            ownerName: response.data.name,
            nic: response.data.nic
          }));
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      };
      fetchUserData();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file); // Store the actual file for upload
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['petName', 'specie', 'breed', 'location', 'age', 'gender', 'reason', 'ifTemp', 'justify'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        window.alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
        return;
      }
    }
  
    try {
      setIsSubmitting(true);
      
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });
      
      // Append photo if exists
      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }
      
      const response = await axiosInstance.post('/pets/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Success - reset form but keep user contact info
      setFormData({
        petName: '',
        specie: '',
        breed: '',
        location: userData?.location || '',
        age: '',
        gender: '',
        reason: '',
        ifTemp: '',
        justify: '',
        vaccinationStatus: '',
        colorMarkings: '',
        size: '',
        spayedNeutered: false,
        medicalHistory: '',
        behavior: '',
        specialNeeds: '',
        adoptionFee: 0,
        adoptionFeeFree: false,
        ownerName: userData?.name || '',
        nic: userData?.nic || '',
        contactEmail: userData?.email || '',
        contactPhoneNumber: userData?.phone || '',
      });
      setPhotoFile(null);
      setPhotoPreview(null);
      
      window.alert('Pet submitted successfully! You can now add another pet if needed.');
    } catch (error) {
      console.error("Error submitting pet", error);
      window.alert('Error submitting pet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="isolated-guest-container">
        <div className="isolated-guest-content">
          <div className="isolated-guest-header">
            <FaLock className="isolated-guest-lock-icon" />
            <h2 className="isolated-guest-title">Secure Pet Submission</h2>
          </div>
          
          <div className="isolated-guest-message">
            <div className="isolated-guest-icon">
              <FaPaw />
            </div>
            <h3>Join Our Pet Adoption Community</h3>
            <p>
              To submit a pet for adoption, we require you to create an account. 
              This helps us maintain a safe and trustworthy environment for all pets and adopters.
            </p>
            
            <div className="isolated-guest-benefits">
              <h4>By creating an account, you'll be able to:</h4>
              <ul>
                <li><FaPaw className="benefit-icon" /> Submit pets for adoption with full details</li>
                <li><FaPaw className="benefit-icon" /> Manage all your pet listings in one place</li>
                <li><FaPaw className="benefit-icon" /> Communicate securely with potential adopters</li>
                <li><FaPaw className="benefit-icon" /> Receive updates on your pet's adoption status</li>
                <li><FaPaw className="benefit-icon" /> Access our community resources for pet owners</li>
              </ul>
            </div>
            
            <div className="isolated-guest-cta">
              <button 
                className="isolated-guest-button"
                onClick={() => navigate('/signup')}
              >
                <FaUserPlus /> Create Your Free Account
              </button>
              <p className="isolated-guest-login">
                Already have an account? <Link to="/login">Sign in here</Link>
              </p>
            </div>
            
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="isolated-user-form" onSubmit={handleSubmit}>
      <h4 className="isolated-form-title">Adoption Form</h4>
      
      <div className="isolated-form-row">
        <div className="isolated-form-col isolated-form-col-8">
          <div className="isolated-form-group">
            <label className="isolated-form-label">Name of your pet</label>
            <input
              className="isolated-form-input"
              type="text"
              name="petName"
              placeholder="Enter the name"
              value={formData.petName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="isolated-form-col isolated-form-col-4 isolated-form-center">
        <div className="isolated-photo-upload">
          <div className="isolated-photo-wrapper">
            <div className="isolated-photo-icon">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Uploaded preview"
                  className="isolated-uploaded-photo"
                />
              ) : (
                <FaCamera className="isolated-camera-icon" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="isolated-photo-input"
            />
          </div>
          <label className="isolated-form-label">Add Photo</label>
        </div>
      </div>
      </div>

      <div className="isolated-form-row">
        <div className="isolated-form-col isolated-form-col-6">
          <div className="isolated-form-group">
            <label className="isolated-form-label">Specie</label>
            <select
              className="isolated-form-select"
              name="specie"
              value={formData.specie}
              onChange={handleInputChange}
            >
              <option>Select specie</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="fish">Fish</option>
              <option value="rabbit">Rabbit</option>
              <option value="bird">Bird</option>
            </select>
          </div>
        </div>
        <div className="isolated-form-col isolated-form-col-6">
          <div className="isolated-form-group">
            <label className="isolated-form-label">Breed</label>
            <input
              className="isolated-form-input"
              type="text"
              name="breed"
              placeholder="Enter the breed"
              value={formData.breed}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="isolated-form-row">
        <div className="isolated-form-col isolated-form-col-6">
          <div className="isolated-form-group">
            <label className="isolated-form-label">Age</label>
            <input
              className="isolated-form-input"
              type="text"
              name="age"
              placeholder="Enter pet's age"
              value={formData.age}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="isolated-form-col isolated-form-col-6">
          <div className="isolated-form-group">
            <label className="isolated-form-label">Gender</label>
            <div className="isolated-radio-group">
              <label className="isolated-radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleInputChange}
                />
                <span className="isolated-radio-custom"></span>
                Male
              </label>
              <label className="isolated-radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleInputChange}
                />
                <span className="isolated-radio-custom"></span>
                Female
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="isolated-form-group">
        <label className="isolated-form-label">Location</label>
        <input
          className="isolated-form-input"
          type="text"
          name="location"
          placeholder="Enter the location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </div>

      <div className="isolated-form-row">
        <div className="isolated-form-col isolated-form-col-6">
          <div className="isolated-form-group">
            <label className="isolated-form-label">Residency Type</label>
            <div className="isolated-radio-group">
              <label className="isolated-radio-label">
                <input
                  type="radio"
                  name="reason"
                  value="Temporary"
                  checked={formData.reason === 'Temporary'}
                  onChange={handleInputChange}
                />
                <span className="isolated-radio-custom"></span>
                Temporary
              </label>
              <label className="isolated-radio-label">
                <input
                  type="radio"
                  name="reason"
                  value="Adopt"
                  checked={formData.reason === 'Adopt'}
                  onChange={handleInputChange}
                />
                <span className="isolated-radio-custom"></span>
                Adopt
              </label>
            </div>
          </div>
        </div>
        <div className="isolated-form-col isolated-form-col-6">
          <div className="isolated-form-group">
            <label className="isolated-form-label">Duration</label>
            <select
              className="isolated-form-select"
              name="ifTemp"
              value={formData.ifTemp}
              onChange={handleInputChange}
            >
              <option>Select duration</option>
              <option value="0">None</option>
              <option value="1">1 month</option>
              <option value="2">3 months</option>
              <option value="3">6 months</option>
              <option value="4">1 year</option>
              <option value="5">2 years</option>
            </select>
          </div>
        </div>
      </div>

      <div className="isolated-form-group">
        <label className="isolated-form-label">Justification for giving the pet</label>
        <textarea
          className="isolated-form-textarea"
          name="justify"
          placeholder="Type here..."
          value={formData.justify}
          onChange={handleInputChange}
          rows={3}
        ></textarea>
      </div>

      <div className="isolated-form-row">
        <div className="isolated-form-col isolated-form-col-6">
          <div className="isolated-form-group">
            <label className="isolated-form-label">Vaccination Status</label>
            <select
              className="isolated-form-select"
              name="vaccinationStatus"
              value={formData.vaccinationStatus}
              onChange={handleInputChange}
            >
              <option value="">Select status</option>
              <option value="Up-to-date">Up-to-date</option>
              <option value="Not vaccinated">Not vaccinated</option>
            </select>
          </div>
        </div>
        <div className="isolated-form-col isolated-form-col-6">
          <div className="isolated-form-group">
            <label className="isolated-form-label">Size</label>
            <select
              className="isolated-form-select"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
            >
              <option value="">Select size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
        </div>
      </div>

      <div className="isolated-form-group">
        <label className="isolated-form-label">Color/Markings</label>
        <input
          className="isolated-form-input"
          type="text"
          name="colorMarkings"
          placeholder="Describe color and markings"
          value={formData.colorMarkings}
          onChange={handleInputChange}
        />
      </div>

      <div className="isolated-form-group">
        <label className="isolated-form-label">Spayed/Neutered</label>
        <div className="isolated-radio-group">
          <label className="isolated-radio-label">
            <input
              type="radio"
              name="spayedNeutered"
              value={true}
              checked={formData.spayedNeutered === true}
              onChange={() => setFormData({...formData, spayedNeutered: true})}
            />
            <span className="isolated-radio-custom"></span>
            Yes
          </label>
          <label className="isolated-radio-label">
            <input
              type="radio"
              name="spayedNeutered"
              value={false}
              checked={formData.spayedNeutered === false}
              onChange={() => setFormData({...formData, spayedNeutered: false})}
            />
            <span className="isolated-radio-custom"></span>
            No
          </label>
        </div>
      </div>

      <div className="isolated-form-group">
        <label className="isolated-form-label">Medical History</label>
        <textarea
          className="isolated-form-textarea"
          name="medicalHistory"
          placeholder="Any illnesses, surgeries, or allergies"
          value={formData.medicalHistory}
          onChange={handleInputChange}
          rows={3}
        ></textarea>
      </div>

      <div className="isolated-form-group">
        <label className="isolated-form-label">Behavior</label>
        <textarea
          className="isolated-form-textarea"
          name="behavior"
          placeholder="Describe pet's behavior (friendly, aggressive, shy, trained, etc.)"
          value={formData.behavior}
          onChange={handleInputChange}
          rows={3}
        ></textarea>
      </div>

      <div className="isolated-form-group">
        <label className="isolated-form-label">Special Needs or Instructions</label>
        <textarea
          className="isolated-form-textarea"
          name="specialNeeds"
          placeholder="Any special care requirements"
          value={formData.specialNeeds}
          onChange={handleInputChange}
          rows={3}
        ></textarea>
      </div>

      <div className="isolated-form-row">
        <div className="isolated-form-col isolated-form-col-6">
          <div className="isolated-form-group">
            <label className="isolated-form-label">Adoption Fee</label>
            <div className="isolated-radio-group">
              <label className="isolated-radio-label">
                <input
                  type="radio"
                  name="adoptionFeeFree"
                  value={true}
                  checked={formData.adoptionFeeFree === true}
                  onChange={() => setFormData({...formData, adoptionFeeFree: true, adoptionFee: 0})}
                />
                <span className="isolated-radio-custom"></span>
                Free
              </label>
              <label className="isolated-radio-label">
                <input
                  type="radio"
                  name="adoptionFeeFree"
                  value={false}
                  checked={formData.adoptionFeeFree === false}
                  onChange={() => setFormData({...formData, adoptionFeeFree: false})}
                />
                <span className="isolated-radio-custom"></span>
                Has Fee
              </label>
            </div>
          </div>
        </div>
        {!formData.adoptionFeeFree && (
          <div className="isolated-form-col isolated-form-col-6">
            <div className="isolated-form-group">
              <label className="isolated-form-label">Fee Amount</label>
              <input
                className="isolated-form-input"
                type="number"
                name="adoptionFee"
                placeholder="Enter amount"
                value={formData.adoptionFee}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        )}
      </div>

      <h4 className="isolated-section-title">Contact Information</h4>
      <div className="isolated-contact-section">
        <div className="isolated-form-row">
          <div className="isolated-form-col isolated-form-col-6">
            <div className="isolated-form-group">
              <label className="isolated-form-label">Name</label>
              <input
                className="isolated-form-input"
                type="text"
                name="ownerName"
                placeholder="Enter your name"
                value={formData.ownerName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="isolated-form-col isolated-form-col-6">
            <div className="isolated-form-group">
              <label className="isolated-form-label">NIC</label>
              <input
                className="isolated-form-input"
                type="text"
                name="nic"
                placeholder="Enter your NIC"
                value={formData.nic}
                onChange={handleInputChange}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="isolated-form-row">
          <div className="isolated-form-col isolated-form-col-6">
            <div className="isolated-form-group">
              <label className="isolated-form-label">Email</label>
              <input
                className="isolated-form-input"
                type="email"
                name="contactEmail"
                placeholder="Enter your email"
                value={formData.contactEmail}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="isolated-form-col isolated-form-col-6">
            <div className="isolated-form-group">
              <label className="isolated-form-label">Phone Number</label>
              <input
                className="isolated-form-input"
                type="text"
                name="contactPhoneNumber"
                placeholder="Enter your phone number"
                value={formData.contactPhoneNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      <button 
        type="submit" 
        className="isolated-submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Your Pet'}
      </button>
      
     
    </form>
  );
};

export default UserForm;