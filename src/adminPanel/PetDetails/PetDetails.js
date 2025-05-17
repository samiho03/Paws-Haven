import './PetDetails.css';
import React, { useState, useEffect } from "react";
import axiosInstance from '../../api/axiosConfig';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PetDetails = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/pets/getAll")
      .then((response) => {
        setPets(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the pet data!", error);
      });
  }, []);

  const handleStatusChange = (id, status) => {
    axiosInstance
      .put(`/pets/${id}/status?status=${status}`)
      .then((response) => {
        setPets((prevPets) =>
          prevPets.map((pet) =>
            pet.id === id ? { ...pet, regStatus: status } : pet
          )
        );
      })
      .catch((error) => {
        console.error("Error updating the status!", error);
      });
  };

  // Helper function to safely handle null values
  const getSafeValue = (value, defaultValue = 'N/A') => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  // Helper function to format boolean values
  const formatBoolean = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return value ? 'Yes' : 'No';
  };

  
  return (
    <div id="pet-details-container">
      <h2 className="pet-list-title">Requested List</h2>
      {pets.length > 0 ? (
        <table className="pet-list-table">
          <thead className="pet-list-header">
            <tr>
              <th className="pet-list-th">ID</th>
              <th className="pet-list-th">Pet Name</th>
              <th className="pet-list-th pet-list-details-col">Pet Details</th>
              <th className="pet-list-th">Residency & Temporary</th>
              <th className="pet-list-th">Justification</th>
              <th className="pet-list-th">Owner Details</th>
              <th className="pet-list-th">Reg. Status</th>
              <th className="pet-list-th">Decision</th>
            </tr>
          </thead>

          <tbody className="pet-list-body">
            {pets.map((pet) => (
              <tr key={pet.id} className="pet-list-row">
                <td className="pet-name">{getSafeValue(pet.id)}</td>
                <td className="pet-name">{getSafeValue(pet.petName)}</td>
                <td className="pet-details">
                  <div className="detail-section">
                    <span className="category-label">Specie:</span> {getSafeValue(pet.specie)}<br />
                    <span className="category-label">Breed:</span> {getSafeValue(pet.breed)}<br />
                    <span className="category-label">Age:</span> {getSafeValue(pet.age)}<br />
                    <span className="category-label">Gender:</span> {getSafeValue(pet.gender)}<br />
                    <span className="category-label">Size:</span> {getSafeValue(pet.size)}<br />
                    <span className="category-label">Color:</span> {getSafeValue(pet.colorMarkings)}
                  </div>
                  <div className="detail-section">
                    <span className="category-label">Vaccination:</span> {getSafeValue(pet.vaccinationStatus)}<br />
                    <span className="category-label">Spayed/Neutered:</span> {formatBoolean(pet.spayedNeutered)}<br />
                    <span className="category-label">Adoption Fee:</span> 
                    {pet.adoptionFeeFree ? 'Free' : `Rs.${getSafeValue(pet.adoptionFee, '0')}`}
                  </div>
                </td>
                <td className="pet-reason-temp">
                  <span className="category-label">Residency:</span> {getSafeValue(pet.reason)}<br />
                  <span className="category-label">If Temporary:</span> {getSafeValue(pet.ifTemp)}<br />
                  <span className="category-label">Location:</span> {getSafeValue(pet.location)}
                </td>
                <td className="pet-justify">
                  <div className="justification-text">
                    {getSafeValue(pet.justify)}
                  </div>
                  {pet.specialNeeds && (
                    <div className="special-needs">
                      <span className="category-label">Special Needs:</span> {getSafeValue(pet.specialNeeds)}
                    </div>
                  )}
                  {pet.medicalHistory && (
                    <div className="medical-history">
                      <span className="category-label">Medical History:</span> {getSafeValue(pet.medicalHistory)}
                    </div>
                  )}
                  {pet.behavior && (
                    <div className="behavior">
                      <span className="category-label">Behavior:</span> {getSafeValue(pet.behavior)}
                    </div>
                  )}
                </td>
                <td className="owner-details">
                  <span className="category-label">Owner:</span> {getSafeValue(pet.ownerName)}<br />
                  <span className="category-label">NIC:</span> {getSafeValue(pet.nic)}<br />
                  <span className="category-label">Email:</span> {getSafeValue(pet.contactEmail)}<br />
                  <span className="category-label">Phone No:</span> {getSafeValue(pet.contactPhoneNumber)}
                </td>
                <td className="pet-reg-status">
                  <span className={`status-badge ${pet.regStatus ? pet.regStatus.toLowerCase() : 'pending'}`}>
                    {getSafeValue(pet.regStatus, 'Pending')}
                  </span>
                </td>
                <td>
                  <div className="button-container">
                    <button 
                      className="approve-button" 
                      onClick={() => handleStatusChange(pet.id, "Approved")}
                      disabled={pet.regStatus === "Approved"}
                    >
                      <i className="fas fa-check"></i> Approve
                    </button>
                    <button 
                      className="reject-button" 
                      onClick={() => handleStatusChange(pet.id, "Rejected")}
                      disabled={pet.regStatus === "Rejected"}
                    >
                      <i className="fas fa-times"></i> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-pets-message">No pets available for adoption.</p>
      )}
    </div>
  );
};

export default PetDetails;