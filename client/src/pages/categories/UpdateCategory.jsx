import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    // Fetch the current category details
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(`/api/category/${id}`); // Updated URL here
        setCategory(data);
        setFormData({
          description: data.description || '', // Default to empty string if not available
          tags: (data.tags || []).join(', '), // Default to empty array if not available
        });
      } catch (error) {
        console.error('Failed to fetch category:', error);
        // Optionally, set an error state here or show a user-friendly message
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedCategory = {
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()), // Convert string back to array
    };

    try {
      await axios.put(`/api/category/${id}`, updatedCategory); // Updated URL here
      navigate('/categories'); // Redirect after successful update
    } catch (error) {
      console.error('Failed to update category:', error);
      // Optionally, set an error state here or show a user-friendly message
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Update Category
        </Typography>
        <form onSubmit={handleSubmit}>
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
