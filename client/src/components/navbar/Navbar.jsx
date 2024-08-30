import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Avatar, Button, Box } from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout, user, postNavbarDetails, setPostNavbarDetails } = useContext(AuthContext);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isOnCategoriesPage = location.pathname === '/categories';
  const isOnRequestPage = location.pathname === '/categories/make-request';
  const isOnRequestManagePage = location.pathname === '/approve-request';
  // const showMakeRequest = isOnCategoriesPage && user && (user.role === "teacher" || user.role === "admin");
  const showMakeRequest = (isOnCategoriesPage || isOnRequestPage || isOnRequestManagePage) && user && (user.role === "teacher" || user.role === "admin");
  // const showManageRequest = isOnCategoriesPage && user && user.role === "admin";
  const showManageRequest = (isOnCategoriesPage || isOnRequestPage || isOnRequestManagePage) && user && user.role === "admin";
  const isOnPostsPage = location.pathname.startsWith('/post/');
  // const isOnHomePage = location.pathname ==='/'
  const isOnHomePage = false
  const showCategories = true

  useEffect( ()=>{
    if(!isOnPostsPage){
      setPostNavbarDetails({id:null, name:null})
    }
  },[isOnPostsPage])

  return (
    <Box className="flex justify-center">
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#e8e8e8',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '9999px',
          maxWidth: '1100px',
          padding: '0 2rem',
          margin: '0rem 0'
        }}
      >
        <Toolbar className="flex justify-between">
          <Typography variant="h6" className="text-gray-800 font-semibold" onClick={() => navigate('/')}>
            YourLogo
          </Typography>

          <div className="flex items-center space-x-6">

            {showMakeRequest && (
              <Button
                variant="outlined"
                sx={{ color: '#333', borderColor: '#2f2f31', textTransform: 'capitalize', '&:hover': { color: '#555', borderColor: '#535357' } }}
                onClick={() => navigate('/categories/make-request')}
              >
                Make Request
              </Button>
            )}

            {showManageRequest && (
              <Button
                variant="outlined"
                sx={{ color: '#333', borderColor: '#2f2f31', textTransform: 'capitalize', '&:hover': { color: '#555', borderColor: '#535357' } }}
                onClick={() => navigate('/approve-request')}
              >
                Manage Requests
              </Button>
            )}

            {isOnPostsPage && postNavbarDetails.name !== null && (
              <Button
                variant="outlined"
                sx={{ color: '#333', borderColor: '#2f2f31', textTransform: 'capitalize', '&:hover': { color: '#555', borderColor: '#535357' } }}
                onClick={() =>  navigate(`/category/${postNavbarDetails.id}`) }
              >
                {postNavbarDetails.name}
              </Button>
            )}

            {showCategories && (
              <Button
                variant="outlined"
                sx={{ color: '#333', borderColor: '#2f2f31', textTransform: 'capitalize', '&:hover': { color: '#555', borderColor: '#535357' } }}
                onClick={() =>  navigate(`/categories`) }
              >
                Categories
              </Button>
            )}

            {!isOnHomePage && (
              <Button
                variant="outlined"
                sx={{ color: '#333', borderColor: '#2f2f31', textTransform: 'capitalize', '&:hover': { color: '#555', borderColor: '#535357' } }}
                onClick={() => navigate('/')}
              >
                Home
              </Button>
            )}

            <IconButton onClick={handleMenuOpen}>
              <Avatar alt="Username" src="/profile-pic.jpg" />
            </IconButton>

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
              <MenuItem onClick={() => navigate('/profile')} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
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