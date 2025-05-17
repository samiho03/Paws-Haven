import React, { useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { TextField, Button, Paper, Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import './DocDecision.css';

const DocDecision = () => {
  const [pet, setPet] = useState({
    id: '',
    petName: '',
    specie: '',
    breed: '',
    location: '',
    age: '',
    gender: '',
    reason: '',
    ifTemp: '',
    justify: '',
    contactEmail: '',
    contactPhoneNumber: '',
    ownerName: '',
    nic: '',
    photo: '',
    regStatus: '',
    physicalStatus: '',
    docName: '',
    docStatus: '',
    totalCost: 0,
    discount: 0,
    netCost: 0,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPet((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDocStatusChange = (event) => {
    setPet((prevState) => ({ ...prevState, docStatus: event.target.value }));
  };

  const resetForm = () => {
    setPet({
      id: '',
      petName: '',
      specie: '',
      breed: '',
      location: '',
      age: '',
      gender: '',
      reason: '',
      ifTemp: '',
      justify: '',
      contactEmail: '',
      contactPhoneNumber: '',
      ownerName: '',
      nic: '',
      photo: '',
      regStatus: '',
      physicalStatus: '',
      docName: '',
      docStatus: '',
      discount: 0,
      totalCost: 0,
      netCost: 0,
    });
    setIsEditing(false);
  };

  const handleSearch = (e) => {
    e.preventDefault(); 
    axiosInstance
      .get(`/pets/get/${pet.id}`) // Use the axiosInstance
      .then((response) => {
        if (response.data) {
          console.log('Pet found:', response.data);
          setPet(response.data);
          setIsEditing(true);
        } else {
          alert('Pet not found!');
        }
      })
      .catch((error) => {
        console.error('Error fetching pet details:', error);
        alert('Error fetching pet details.');
      });
  };

  const handleUpdate = () => {
    axiosInstance
      .put(`/pets/update/${pet.id}`, pet) // Use the axiosInstance
      .then((response) => {
        alert('Pet updated successfully!');
        resetForm();
      })
      .catch((error) => {
        console.error('Error updating pet:', error);
        alert('Error updating pet.');
      });
  };

  return (
    <div style={{  padding: '40px', paddingRight:'-20px'  }}>
      <h2 style={{ color: 'black', marginTop: '-20px', marginBottom: '40px' }}>Doctor Decision Management</h2>
      <form>
        <div className="search-container">
          <input
            type="text"
            name="id"
            value={pet.id}
            onChange={handleInputChange}
            placeholder="   Enter Pet ID"
            className="textCombo"
            style={{
              backgroundColor: 'transparent',
              borderRadius: '10px',
              borderColor: '#cbcbcb',
              borderStyle: 'solid',
            }}
          />
          <Button
            onClick={handleSearch}
            className="search-continue-btn"
            style={{
              borderRadius: '10px',
              backgroundColor: '#1f1d1c',
              color: '#ffffff',
            }}
          >
            Search
          </Button>
        </div>
        <TextField
          label="Pet Name"
          name="petName"
          value={pet.petName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          sx={{ '& fieldset': { borderRadius: '15px' } }}
        />
        <TextField
          label="Species"
          name="specie"
          value={pet.specie}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          sx={{ '& fieldset': { borderRadius: '15px' } }}
        />
        <TextField
          label="Breed"
          name="breed"
          value={pet.breed}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          sx={{ '& fieldset': { borderRadius: '15px' } }}
        />
        <TextField
          label="Gender"
          name="gender"
          value={pet.gender}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          sx={{ '& fieldset': { borderRadius: '15px' } }}
        />
        <TextField
          label="Age"
          name="age"
          value={pet.age}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          sx={{ '& fieldset': { borderRadius: '15px' } }}
        />
        <Paper
          style={{
            marginTop: '40px',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#ede8d0',
            borderRadius: '10px',
          }}
        >
          <TextField
            label="Doctor Name"
            name="docName"
            value={pet.docName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            sx={{ '& fieldset': { borderRadius: '15px' } }}
          />
          <Box sx={{ minWidth: 120, '& fieldset': { borderRadius: '15px' }, marginTop: '10px', marginBottom: '10px' }}>
            <FormControl fullWidth>
              <InputLabel id="doc-status-label">Decision</InputLabel>
              <Select
                labelId="doc-status-label"
                id="doc-status-select"
                value={pet.docStatus}
                label="Doctor's Decision"
                onChange={handleDocStatusChange}
              >
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          style={{
            marginTop: '20px',
            borderRadius: '10px',
            paddingLeft: '30px',
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingRight: '30px',
            backgroundColor: '#1c1e21',
          }}
        >
          Add Decision
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={resetForm}
          style={{
            marginLeft: '20px',
            marginTop: '20px',
            borderRadius: '10px',
            paddingLeft: '30px',
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingRight: '30px',
            backgroundColor: '#1c1e21',
          }}
        >
          Clear
        </Button>
      </form>
    </div>
  );
};

export default DocDecision;