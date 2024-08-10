import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ApproveRequests.css'; // Import CSS file for styling

const ApproveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3000/api/category/request', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error.response ? error.response.data : error.message);
        setError('Failed to fetch requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleApprove = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`http://localhost:3000/api/category/requests/${id}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      setRequests(requests.filter(request => request._id !== id));
    } catch (error) {
      console.error('Error approving request:', error.response ? error.response.data : error.message);
      setError('Failed to approve request.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`http://localhost:3000/api/category/requests/${id}/reject`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      setRequests(requests.filter(request => request._id !== id));
    } catch (error) {
      console.error('Error rejecting request:', error.response ? error.response.data : error.message);
      setError('Failed to reject request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="approve-requests-container">
      <h1>Approve Category Requests</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="requests-list">
        {requests.map(request => (
          <div key={request._id} className="request-card">
            <h2>{request.categoryName}</h2>
            <p>{request.description}</p>
            <p><strong>Tags:</strong> {request.tags.join(', ')}</p>
            <div className="request-card-actions">
              <button onClick={() => handleApprove(request._id)} disabled={loading}>Approve</button>
              <button onClick={() => handleReject(request._id)} disabled={loading}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApproveRequests;
