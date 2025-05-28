import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './MessageDetails.css';

const MessageDetails = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/api/v1/contact/admin/messages', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          navigate('/login', { state: { from: '/admin/messages' } });
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsResponded = async (messageId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/contact/admin/messages/${messageId}/respond`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          navigate('/login', { state: { from: '/admin/messages' } });
          return;
        }
        throw new Error(`Failed to update message status: ${response.status}`);
      }

      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, responded: true } : msg
      ));
      setSuccessMessage('Message marked as responded successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating message:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="messages-container">
        <div className="loading-spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>Contact Messages</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchMessages}>Try Again</button>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {messages.length === 0 ? (
        <p className="no-messages">
          {error ? 'Failed to load messages' : 'No messages found'}
        </p>
      ) : (
        <div className="messages-list">
          {messages.map(message => (
            <div key={message.id} className={`message-card ${message.responded ? 'responded' : ''}`}>
              <div className="message-header">
                <h3>{message.subject}</h3>
                <span className="message-date">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="message-sender">
                <strong>From:</strong> {message.name} ({message.email})
              </div>
              <div className="message-content">
                <p>{message.message}</p>
              </div>
              <div className="message-actions">
                {!message.responded && (
                  <button 
                    onClick={() => markAsResponded(message.id)}
                    className="respond-button"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Mark as Responded'}
                  </button>
                )}
                {message.responded && (
                  <span className="responded-badge">
                    Responded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageDetails;