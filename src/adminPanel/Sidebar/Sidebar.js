import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaPaw, FaFileInvoice, FaUserMd, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';

import './Sidebar.css';

const Sidebar = ({ onLogout }) => { 

  return (
    <div>
      {/* Top Bar */}
      <div className="topbar">
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          {/* Use the logo from src/assets or public */}
          <img  alt="Logo" className="sidebar-logo-img" />
        </div>
        <h2 className="sidebar-title">Paws Haven</h2>
        <ul className="sidebar-list">
          <li>
            <NavLink exact to="/admin/pets" activeClassName="active-link">
              <FaPaw className="sidebar-icon" />
              Requested Pets
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/pet-profile" activeClassName="active-link">
              <FaHome className="sidebar-icon" />
              Pet Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/doctor-decision" activeClassName="active-link">
              <FaFileInvoice className="sidebar-icon" />
              Doctor's Decision
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/doctors" activeClassName="active-link">
              <FaUserMd className="sidebar-icon" />
              Doctors
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/employees" activeClassName="active-link">
              <FaClipboardList className="sidebar-icon" />
              Employees
            </NavLink>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="sidebar-logout" onClick={onLogout}> {/* Call onLogout on click */}
          <FaSignOutAlt className="sidebar-icon" />
        
        </div>
      </div>
      <div className="Bellbar"></div>
    </div>
  );
};

export default Sidebar;
