import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';

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
        const response = await axios.get('http://localhost:3000/api/category/request/pending', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
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
      const response = await fetch(`http://localhost:3000/api/category/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
      }

      const data = await response.json();
      console.log('Approval response:', data);
      setRequests(requests.filter(request => request._id !== id));
    } catch (error) {
      console.error('Error approving request:', error.message);
      setError('Failed to approve request.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`http://localhost:3000/api/category/${id}/reject`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setRequests(requests.filter(request => request._id !== id));
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error rejecting request:', error.response ? error.response.data : error.message);
      setError('Failed to reject request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Approve Category Requests
      </Typography>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography variant="h6" color="error" align="center" gutterBottom>
          Error: {error}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {requests.length === 0 && !loading && (
          <Typography variant="body1" align="center">
            No requests to display.
          </Typography>
        )}
        {requests.map(request => (
          <Card key={request._id} sx={{ 
            boxShadow: 3, 
            borderRadius: 2, 
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: 6,
            },
          }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {request.categoryName}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Tags:</strong> {request.tags.join(', ')}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => handleApprove(request._id)}
                disabled={loading}
                sx={{ 
                  '&:hover': {
                    backgroundColor: '#1E88E5',
                    boxShadow: 4,
                  },
                }}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleReject(request._id)}
                disabled={loading}
                sx={{ 
                  ml: 2,
                  '&:hover': {
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    boxShadow: 4,
                  },
                }}
              >
                Reject
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default ApproveRequests;
