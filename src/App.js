import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Signup from './pages/Auth/Signup/Signup';
import Login from './pages/Auth/Login/Login';
import Profile from './pages/Profile/Profile';
import Footer from './components/Footer/Footer';
import Form from './pages/UserForm/UserForm';
import Home from './pages/Home/Home';
import About from './components/About/About';
import Services from './pages/Services/Services';
import FAQ from './pages/FAQ/FAQ';
import Contact from './pages/Contact/Contact';
import Pets from './components/Pets/Pets';
import Favorites from './pages/Favorites/Favorites';
import PetDetail from './pages/PetDetail/PetDetail';
import PetList from './pages/PetList/PetList';
import LayoutWrapper from './layouts/LayoutWrapper';
import PetDetailsForm from './adminPanel/PetDetails/PetDetails';
import DoctorDetails from './adminPanel/DocDetails/DocDetails';
import EmployeeDetails from './adminPanel/EmpDetails/EmpDetails';
import Sidebar from './adminPanel/Sidebar/Sidebar';
import PetProfile from './adminPanel/PetProfile/PetProfile';
import DocDecision from './adminPanel/DocDecision/DocDecision';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLoginSuccess = (token, role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    console.log('Token saved:', token);
    console.log('User Role:', role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    return token && role === 'ADMIN' ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      {isLoggedIn && userRole === 'ADMIN' ? (
        <div className="app-container">
          <Sidebar onLogout={handleLogout} />
          <div className="content">
            <Routes>
              <Route path="/admin/pets" element={<AdminRoute><PetDetailsForm /></AdminRoute>} />
              <Route path="/admin/pet-profile" element={<AdminRoute><PetProfile /></AdminRoute>} />
              <Route path="/admin/doctor-decision" element={<AdminRoute><DocDecision /></AdminRoute>} />
              <Route path="/admin/doctors" element={<AdminRoute><DoctorDetails /></AdminRoute>} />
              <Route path="/admin/employees" element={<AdminRoute><EmployeeDetails /></AdminRoute>} />
              <Route path="*" element={<Navigate to="/admin/pets" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route element={<LayoutWrapper />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/petlist" element={<PetList />} />
            <Route path= "/petDetail/:id" element={<PetDetail />} />
            <Route path= "/favorites" element={<Favorites />} />
            <Route path="/form" element={<Form />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/login" 
              element={<Login onLoginSuccess={handleLoginSuccess} />} 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile onLogout={handleLogout} userRole={userRole} />
                </PrivateRoute>
              } 
            />
           
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
};

export default App;