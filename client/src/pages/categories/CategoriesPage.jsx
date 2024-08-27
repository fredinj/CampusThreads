import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
} from "@mui/material";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const navigateToMakeRequest = () => {
    navigate("/categories/make-request/");
  };

  const navigateToApproveRequest = () => {
    navigate("/approve-request");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/category", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ marginTop: 2 }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{
          borderRadius: 2,
          top: 0,
          left: 0,
          right: 0,
          padding: 1,
          zIndex: 1100,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar>
          <Button color="primary" onClick={() => navigate("/")}>
            Home
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {(user.role === "teacher" || user.role === "admin") && (
            <Button
              variant="contained"
              color="primary"
              onClick={navigateToMakeRequest}
              sx={{
                marginRight: 2,
                background: "linear-gradient(45deg, #1e88e5 30%, #64b5f6 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1e88e5 40%, #64b5f6 90%)",
                },
                boxShadow: "0 3px 5px 2px rgba(30, 136, 229, .3)",
                borderRadius: 2,
              }}
            >
              Make Request
            </Button>
          )}
          {user.role === "admin" && (
            <Button
              variant="contained"
              color="secondary"
              onClick={navigateToApproveRequest}
              sx={{
                background: "linear-gradient(45deg, #d32f2f 30%, #f44336 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #d32f2f 40%, #f44336 90%)",
                },
                boxShadow: "0 3px 5px 2px rgba(211, 47, 47, .3)",
                borderRadius: 2,
              }}
            >
              View Requests
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ marginTop: 12 }}>
        <Grid container spacing={4}>
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={category._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    animation: `slideUp 0.5s ${index * 0.1}s ease-out both`,
                    "@keyframes slideUp": {
                      from: { opacity: 0, transform: "translateY(20px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                    borderRadius: 3,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/category/${category._id}`)}
                    >
                      Explore More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                No categories found.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default CategoriesPage;
