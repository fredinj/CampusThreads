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
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const navigateToMakeRequest = () => {
    navigate("/categories/make-request/");
  };

  const navigateToApproveRequest = () => {
    navigate("/approve-request");
  };

  const navigateToUpdateCategory = (categoryId) => {
    navigate(`/categories/${categoryId}/update`);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
  
    try {
      const response = await axios.delete(`/api/category/${categoryId}`, {
        withCredentials: true, // Ensures cookies are included with the request
      });
  
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryId)
      );
    } catch (err) {
      setError(err.message);
    }
  };
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category", {
          withCredentials: true,
        });
        setCategories(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCategories(false);
      }
    };
  
    fetchCategories();
  }, []);
  

  if (loadingCategories)
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
                    borderRadius: 2,
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      sx={{
                        color: "#284B63",
                        fontWeight: 600,
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#3C6E71",
                      }}
                    >
                      {category.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/category/${category._id}`)}
                      sx={{
                        color: "#3C6E71",
                        "&:hover": {
                          color: "#284B63",
                        },
                      }}
                    >
                      Explore More
                    </Button>
                    {(user.role === "teacher" || user.role === "admin") && (
                      
                        <Button
                          size="small"
                          sx={{
                            color: "#592941",
                            "&:hover": {
                              color: "#3C6E71",
                            },
                          }}
                          onClick={() => navigateToUpdateCategory(category._id)}
                        >
                          Update
                        </Button>
                    )}
                     {(user.role === "admin") && (
                        <Button
                          size="small"
                          sx={{
                            color: "#D32F2F",
                            "&:hover": {
                              color: "#B71C1C",
                            },
                          }}
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Delete
                        </Button>
                      
                    )}
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
