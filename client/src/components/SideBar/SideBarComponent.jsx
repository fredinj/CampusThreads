import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import axios from '../../api/axiosConfig';
import { Box, Typography, Chip, CircularProgress, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

// Elegant sidebar container with transparent background
const SidebarContainer = styled(Box)({
  width: '250px',
  height: '100vh',
  backgroundColor: 'transparent', // Transparent background
  padding: '16px',
  boxShadow: '1px 0 4px rgba(0, 0, 0, 0.05)', // Subtle shadow to blend with the page
  overflowY: 'auto',  // Enables vertical scrolling
  borderRight: '1px solid #e5e5e5', // Very light grey border for blending
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',  // Align items to the start of the sidebar
  transition: 'background-color 0.3s ease', // Smooth transition for background color
  borderRadius: '8px', // Softer border radius
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

// Pastel colors for tags
const pastelColors = [
    '#f4978e', // Pastel Pink
    '#f2cc8f', // Pastel Peach
    '#83c5be', // Pastel Mint
    '#D4E9E2', // Pastel Light Mint
    '#a8dadc', // Pastel Blue
    '#62b6cb', // Pastel Teal
  ];
  

// Styled chip component for tags
const TagChip = styled(Chip)(({ colorindex }) => ({
  margin: '4px 0',
  borderRadius: '12px', // Less curved for a sleek look
  backgroundColor: pastelColors[colorindex % pastelColors.length], // Apply pastel color
  color: '#333', // Darker color for text
  fontSize: '14px',  // Smaller font size for a sleek look
  fontWeight: '500', // Medium weight for a balanced look
  border: `1px solid ${pastelColors[colorindex % pastelColors.length]}`, // Border with same color as background
  transition: 'background-color 0.3s ease, transform 0.3s ease', // Smooth transition for background and transform
  '&:hover': {
    backgroundColor: pastelColors[(colorindex + 1) % pastelColors.length], // Slightly different pastel on hover
    color: '#111', // Darker text on hover
    transform: 'scale(1.03)', // Slight zoom effect on hover
  },
  '&:focus': {
    backgroundColor: pastelColors[(colorindex + 1) % pastelColors.length], // Slightly different pastel on focus
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)', // Focus ring
  },
}));

const TagSidebar = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate for programmatic navigation

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/posts/tags');
        setTags(response.data.tags);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching tags');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag) => {
    console.log(`/posts-by-tag/${tag}`)
    navigate(`/posts-by-tag/${tag}`); // Navigate to the posts-by-tag route with the selected tag
  };

  if (isLoading) {
    return (
      <SidebarContainer>
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium', color: '#ffffff' }}>Loading tags...</Typography>
      </SidebarContainer>
    );
  }

  if (error) {
    return (
      <SidebarContainer>
        <Typography variant="body1" color="error">Error: {error}</Typography>
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer>
      <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#ffffff' }}>
  <Tag style={{ verticalAlign: 'middle', marginRight: 8, color: '#ffffff' }} />
  Tags
</Typography>

      </Box>
      <Divider sx={{ mb: 2, borderColor: '#e5e5e5' }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {tags.map((tag, index) => (
          <TagChip
            key={tag}
            label={tag}
            colorindex={index}  // Pass index to style tag chips
            variant="outlined"
            clickable
            onClick={() => handleTagClick(tag)} // Handle tag click
          />
        ))}
      </Box>
    </SidebarContainer>
  );
};

export default TagSidebar;
