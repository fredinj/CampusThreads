import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Typography, Chip, CircularProgress, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define pastel colors for the chips
const pastelColors = [
  '#f4978e', // Pastel Pink
  '#f2cc8f', // Pastel Peach
  '#83c5be', // Pastel Mint
  '#D4E9E2', // Pastel Light Mint
  '#a8dadc', // Pastel Blue
  '#62b6cb', // Pastel Teal
];


// Adjusted styling to better blend in
const RightBarContainer = styled(Box)({
  width: '300px',
  height: '100vh',
  backgroundColor: 'transparent', // Lighter background to match the main content
  padding: '16px',
  boxShadow: 'none', // Removed shadow for a flatter look
  overflowY: 'auto',
  borderLeft: '1px solid #e0e0e0', // Subtle border to blend in
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  borderRadius: '4px', // Softer corners
  backdropFilter: 'blur(3px)', // Minimal blur effect
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#d0d0d0',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#b0b0b0',
  },
});

const CategoryChip = styled(Chip)(({ colorindex }) => ({
  margin: '8px 0',
  borderRadius: '4px', // Slightly rounded corners
  backgroundColor: pastelColors[colorindex % pastelColors.length], // Pastel colors
  color: '#333',
  fontSize: '14px',
  fontWeight: '400',
  border: 'none',
  padding: '6px 12px',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    backgroundColor: pastelColors[(colorindex + 1) % pastelColors.length], // Slightly different pastel shade on hover
    color: '#111',
    transform: 'scale(1.02)',
  },
  '&:focus': {
    backgroundColor: pastelColors[(colorindex + 1) % pastelColors.length],
    boxShadow: 'none',
  },
}));

const RightBarComponent = () => {

  const navigate = useNavigate()

  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user || !user._id) {
        setError('User ID is not defined');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/category/${user._id}/categories`);
        
        // Log the response data for debugging
        console.log('API Response:', response.data);
        
        // Update categories to match the expected structure
        setCategories(response.data || []);
      } catch (err) {
        // Log the error message for debugging
        console.error('API Error:', err);
        setError(err.message || 'An error occurred while fetching categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  if (isLoading) {
    return (
      <RightBarContainer>
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium' }}>Loading categories...</Typography>
      </RightBarContainer>
    );
  }

  if (error) {
    return (
      <RightBarContainer>
        <Typography variant="body1" color="error">Error: {error}</Typography>
      </RightBarContainer>
    );
  }

  return (
    <RightBarContainer>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
        Subscribed Categories
      </Typography>
      <Divider sx={{ mb: 2, borderColor: '#e5e5e5' }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {categories.map((category, index) => (
          <CategoryChip
            key={category.id} // Use category id as key
            onClick={()=>(navigate(`/category/${category.id}`))}
            label={category.name} // Use category name for the label
            variant="outlined"
            clickable
            colorindex={index} // Pass index for pastel colors
          />
        ))}
      </Box>
    </RightBarContainer>
  );
};

export default RightBarComponent;
