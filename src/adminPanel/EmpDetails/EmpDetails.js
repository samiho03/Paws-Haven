import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Pagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const EmpDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);

  useEffect(() => {
    console.log('Token before API call:', localStorage.getItem('token'));  
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get('/employees'); // Use axiosInstance instead of axios
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const createEmployee = async () => {
    try {
      await axiosInstance.post('/employees', employee); // Use axiosInstance here
      fetchEmployees();
      clearForm();
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const updateEmployee = async () => {
    try {
      await axiosInstance.put(`/employees/${editingId}`, employee); // Use axiosInstance here
      fetchEmployees();
      clearForm();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axiosInstance.delete(`/employees/${id}`); // Use axiosInstance here
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateEmployee();
    } else {
      createEmployee();
    }
  };

  const handleEdit = (employee) => {
    setEmployee(employee);
    setIsEditing(true);
    setEditingId(employee.id);
  };

  const clearForm = () => {
    setEmployee({ firstName: '', lastName: '', email: '', phoneNumber: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phoneNumber.includes(searchQuery)
  );

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div style={{  padding: '40px', paddingRight:'-20px'  }}>
      <h2 style={{ color: 'black' ,marginTop:'-20px' }}>Employee Management</h2>

      <TextField
        label="Search Employees"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        margin="normal"
        placeholder="Search by name, email, or phone number"
        sx={{ '& fieldset': { borderRadius: '15px' } }}
      />

      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          value={employee.firstName}
          onChange={(e) => setEmployee({ ...employee, firstName: e.target.value })}
          fullWidth
          margin="normal"
          sx={{ '& fieldset': { borderRadius: '15px' } }}
        />
        <TextField
          label="Last Name"
          value={employee.lastName}
          onChange={(e) => setEmployee({ ...employee, lastName: e.target.value })}
          fullWidth
          margin="normal"
          sx={{ '& fieldset': { borderRadius: '15px' } }}
        />
        <TextField
          label="Email"
          value={employee.email}
          onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
          fullWidth
          margin="normal"
          sx={{ '& fieldset': { borderRadius: '15px' } }}
        />
        <TextField
          label="Phone Number"
          value={employee.phoneNumber}
          onChange={(e) => setEmployee({ ...employee, phoneNumber: e.target.value })}
          fullWidth
          margin="normal"
          sx={{ '& fieldset': { borderRadius: '15px' } }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: '20px', backgroundColor: isEditing ? '#5D2510' : '#1c1e21'  , borderRadius: '10px',padding: '10px'}}
        >
          {isEditing ? 'Update Employee' : 'Create Employee'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={clearForm}
          style={{ marginLeft: '20px', marginTop: '20px',backgroundColor:'#1c1e21' ,  borderRadius: '10px',paddingLeft: '30px', paddingTop:'10px', paddingBottom:'10px', paddingRight:'30px'}}
        >
          Clear
        </Button>
      </form>

      <Paper style={{ marginTop: '40px', padding: '20px',backgroundColor:'#ede8d0',borderRadius: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.firstName}</TableCell>
                  <TableCell>{emp.lastName}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phoneNumber}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(emp)}>
                      <EditIcon style={{ color: '#5D2510' }} />
                    </IconButton>

                    <IconButton onClick={() => deleteEmployee(emp.id)}>
                      <DeleteIcon style={{ color: '#692f22' }} />
                    </IconButton>

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Pagination
          count={Math.ceil(filteredEmployees.length / employeesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          style={{ marginTop: '20px', justifyContent: 'center', display: 'flex' }}
        />
      </Paper>
    </div>
  );
};

export default EmpDetails;


