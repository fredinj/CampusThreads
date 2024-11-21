import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const UpdateCategory = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    description: '',
    tags: [],
  });

  const [formData, setFormData] = useState({
    description: '',
    tags: '',
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const {data} = await axios.get( `/api/category/${id}`, { withCredentials: true } ); // Updated URL here
        setCategory(data);

        setFormData({
          description: data.description || '', 
          tags: (data.tags || []).join(', '), 
        });
      } catch (error) {
        console.error('Failed to fetch category:', error);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryUpdateSubmit = async (e) => {
    e.preventDefault();

    const updatedCategory = {
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()), // Convert string back to array
    };

    try {
      await axios.put(`/api/category/${id}/update`, updatedCategory, {withCredentials: true}); // Updated URL here
      navigate('/categories'); // Redirect after successful update
    } catch (error) {
      console.error('Failed to update category:', error);
      // Optionally, set an error state here or show a user-friendly message
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4, backgroundColor: 'white', color: 'black', padding: 2, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Update Category
        </Typography>
        <form onSubmit={handleCategoryUpdateSubmit}>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
              InputLabelProps={{ style: { color: 'black' } }}
              InputProps={{ style: { color: 'black' } }}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ style: { color: 'black' } }}
              InputProps={{ style: { color: 'black' } }}
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Update Category
          </Button>
        </form>
      </Box>
    </Container>
  );
    
  
};

export default UpdateCategory;
