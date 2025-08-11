import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMaintenanceRequests, closeMaintenanceRequest } from '../services/api';

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    
    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getMaintenanceRequests();
      setRequests(response.requests);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      } else {
        setError('Failed to fetch maintenance requests');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRequest = async (id) => {
    try {
      await closeMaintenanceRequest(id);
      setRequests(requests.filter(request => request.id !== id));
    } catch (error) {
      setError('Failed to close maintenance request');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading maintenance requests...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-panel">
        <div className="admin-header">
          <h1>Maintenance Requests Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="requests-summary">
          <p><strong>Open Requests:</strong> {requests.length}</p>
        </div>

        {requests.length === 0 ? (
          <div className="no-requests">
            <p>No open maintenance requests at this time.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>{request.summary}</h3>
                  <span className="service-type">{request.serviceType}</span>
                </div>
                
                <div className="request-details">
                  <p><strong>Resident:</strong> {request.name}</p>
                  <p><strong>Unit:</strong> {request.unitNumber}</p>
                  <p><strong>Email:</strong> {request.email}</p>
                  <p><strong>Submitted:</strong> {formatDate(request.createdAt)}</p>
                  
                  {request.details && (
                    <div className="request-description">
                      <strong>Details:</strong>
                      <p>{request.details}</p>
                    </div>
                  )}
                </div>

                <div className="request-actions">
                  <button
                    onClick={() => handleCloseRequest(request.id)}
                    className="close-button"
                  >
                    Mark as Closed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
