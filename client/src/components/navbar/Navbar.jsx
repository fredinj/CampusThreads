import React from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Avatar, Button, Box } from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = ({categoryButtonName, categoryId, home=false, categories=true}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [ categoryButton, setCategoryButton ] = useState(categoryButtonName ? categoryButtonName : "Categories")
  const { logout, user } = useContext(AuthContext);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="flex justify-center">
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#e8e8e8', // Custom grayish white color
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '9999px', // Full rounded corners
          maxWidth: '1100px',
          padding: '0 2rem',
        }}
      >
        <Toolbar className="flex justify-between">
          {/* Logo */}
          <Typography variant="h6" className="text-gray-800 font-semibold" onClick={()=>navigate('/')}>
            YourLogo
          </Typography>

          {/* Links/Buttons */}
          <div className="flex items-center space-x-6">

            { home? (
              <Button variant="outlined" sx={{ color: '#333', borderColor: '#2f2f31', textTransform: 'capitalize', '&:hover': { color: '#555', borderColor: '#535357' } }}
                onClick={ ()=> navigate('/') }
              >
                Home
              </Button>
            ) : (<></>)}

            { categories? (
              <Button variant="outlined" sx={{ color: '#333', borderColor: '#2f2f31', textTransform: 'capitalize', '&:hover': { color: '#555', borderColor: '#535357' } }}
                onClick={ ()=> {
                  if (categoryButton === "Categories") navigate('/categories')
                  else navigate(`/category/${categoryId}`)
                }}
              >
                {categoryButton}
              </Button>
            ) : (<></>) }
              
            
            {/* User Profile */}
            <IconButton onClick={handleMenuOpen}>
              <Avatar alt="Username" src="/profile-pic.jpg" />
            </IconButton>
            
            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  mt: 1.5,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.95rem',
                    padding: '8px 16px',
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={ ()=> navigate('/profile') } sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                <AccountCircle sx={{ mr: 2, fontSize: '1.25rem' }} /> Profile
              </MenuItem>
              <MenuItem onClick={logout} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                <Logout sx={{ mr: 2, fontSize: '1.25rem' }} /> Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
