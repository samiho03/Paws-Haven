import React, { useState, useEffect } from 'react';
import { FaPaw, FaUsers, FaEnvelope, FaCheckCircle, FaTimesCircle, FaChartBar } from 'react-icons/fa';
import axiosInstance from '../../api/axiosConfig';
import BarChartComponent from './BarChart';
import PieChartComponent from './PieChart';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPets: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalMessages: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const petsResponse = await axiosInstance.get("/pets/getAll");
      const pets = petsResponse.data;
      
      const totalPets = pets.length;
      const approvedRequests = pets.filter(pet => pet.regStatus === "Approved").length;
      const rejectedRequests = pets.filter(pet => pet.regStatus === "Rejected").length;
      const pendingRequests = pets.filter(pet => !pet.regStatus || pet.regStatus === "Pending").length;
      
      const recentActivity = pets
        .slice(0, 5)
        .map((pet, index) => ({
          id: pet.id,
          type: getActivityType(pet.regStatus),
          message: getActivityMessage(pet),
          time: `${index + 1} ${index === 0 ? 'hour' : 'hours'} ago`
        }));

      setDashboardData({
        totalPets,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        totalMessages: 0,
        recentActivity
      });
      
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getActivityType = (status) => {
    if (status === "Approved") return 'approval';
    if (status === "Rejected") return 'rejection';
    return 'request';
  };

  const getActivityMessage = (pet) => {
    const petName = pet.petName || `Pet ID ${pet.id}`;
    const ownerName = pet.ownerName || 'Unknown Owner';
    
    if (pet.regStatus === "Approved") {
      return `Pet adoption request approved for ${petName} by ${ownerName}`;
    } else if (pet.regStatus === "Rejected") {
      return `Pet adoption request rejected for ${petName} by ${ownerName}`;
    } else {
      return `New adoption request received for ${petName} from ${ownerName}`;
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <div className={`admin-stat-card admin-stat-${color}`}>
      <div className="admin-stat-icon">
        {icon}
      </div>
      <div className="admin-stat-content">
        <h3 className="admin-stat-value">{value}</h3>
        <p className="admin-stat-title">{title}</p>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'approval':
          return <FaCheckCircle className="admin-activity-icon admin-activity-approved" />;
        case 'rejection':
          return <FaTimesCircle className="admin-activity-icon admin-activity-rejected" />;
        case 'request':
          return <FaPaw className="admin-activity-icon admin-activity-pending" />;
        case 'message':
          return <FaEnvelope className="admin-activity-icon admin-activity-message" />;
        default:
          return <FaPaw className="admin-activity-icon" />;
      }
    };

    return (
      <div className="admin-activity-item">
        {getActivityIcon(activity.type)}
        <div className="admin-activity-content">
          <p className="admin-activity-message">{activity.message}</p>
          <span className="admin-activity-time">{activity.time}</span>
        </div>
      </div>
    );
  };

  const handleQuickAction = (action) => {
    if (action === 'messages') {
      window.location.href = '/admin/messages';
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="admin-retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
     
      </div>

      {/* Statistics Cards */}
      <div className="admin-stats-grid">
        <StatCard
          icon={<FaPaw className="admin-stat-icon-svg" />}
          title="Total Pets"
          value={dashboardData.totalPets}
          color="primary"
        />
        <StatCard
          icon={<FaPaw className="admin-stat-icon-svg" />}
          title="Pending Requests"
          value={dashboardData.pendingRequests}
          color="warning"
        />
        <StatCard
          icon={<FaCheckCircle className="admin-stat-icon-svg" />}
          title="Approved Requests"
          value={dashboardData.approvedRequests}
          color="success"
        />
        <StatCard
          icon={<FaTimesCircle className="admin-stat-icon-svg" />}
          title="Rejected Requests"
          value={dashboardData.rejectedRequests}
          color="danger"
        />
      </div>

      {/* Main Content Area */}
      <div className="admin-dashboard-content">
        {/* Left Column */}
        <div className="admin-dashboard-left">
          {/* Analytics Mini View */}
          <div className="admin-analytics-mini">
            <h2 className="admin-section-title">
              <FaChartBar className="admin-section-icon" /> Registration Analytics
            </h2>
            <div className="admin-mini-charts">
              <div className="admin-mini-chart">
                <PieChartComponent 
                  data={dashboardData} 
                  title={null}
                  miniView={true}
                />
              </div>
              <div className="admin-mini-chart">
                <BarChartComponent 
                  data={dashboardData} 
                  title={null}
                  miniView={true}
                />
              </div>
            </div>
          </div>

         
        </div>

        {/* Right Column */}
        <div className="admin-dashboard-right">
          {/* Recent Activity */}
          <div className="admin-recent-activity">
            <h2 className="admin-section-title">Recent Activity</h2>
            <div className="admin-activity-list">
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <p className="admin-no-activity">No recent activity found.</p>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="admin-summary-stats">
            <h2 className="admin-section-title">Key Metrics</h2>
            <div className="admin-metrics-grid">
              <div className="admin-metric-card">
                <h4>Approval Rate</h4>
                <p className="admin-metric-value">
                  {dashboardData.totalPets > 0 
                    ? Math.round((dashboardData.approvedRequests / dashboardData.totalPets) * 100)
                    : 0}%
                </p>
                <p className="admin-metric-description">
                  of total requests approved
                </p>
              </div>
              <div className="admin-metric-card">
                <h4>Processing Rate</h4>
                <p className="admin-metric-value">
                  {dashboardData.totalPets > 0 
                    ? Math.round(((dashboardData.approvedRequests + dashboardData.rejectedRequests) / dashboardData.totalPets) * 100)
                    : 0}%
                </p>
                <p className="admin-metric-description">
                  of requests processed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;