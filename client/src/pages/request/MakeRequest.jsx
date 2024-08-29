import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
  Paper,
  CssBaseline,
} from "@mui/material";

const MakeRequest = () => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/category/request",
        {
          categoryName,
          description,
          tags: tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        navigate("/categories");
      }
    } catch (error) {
      console.error(
        "Submission error:",
        error.response ? error.response.data : error.message
      );
      setError("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="transparent"
        elevation={1}
        sx={{ paddingY: 1, boxShadow: "none", borderBottom: "1px solid #ddd" }}
      >
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Button
            color="primary"
            onClick={() => navigate("/")}
            sx={{
              marginRight: 2,
              fontSize: "0.875rem",
              paddingX: 2,
              paddingY: 0.75,
              borderRadius: "8px",
            }}
          >
            Home
          </Button>
          <Button
            color="primary"
            onClick={() => navigate("/categories")}
            sx={{
              fontSize: "0.875rem",
              paddingX: 2,
              paddingY: 0.75,
              borderRadius: "8px",
            }}
          >
            Categories
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="sm"
        sx={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: "16px",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Request a New Category
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              fullWidth
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
              sx={{ borderRadius: "8px" }}
              InputProps={{
                style: { borderRadius: "8px" },
              }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
              sx={{ borderRadius: "8px" }}
              InputProps={{
                style: { borderRadius: "8px" },
              }}
            />
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags"
              sx={{ borderRadius: "8px" }}
              InputProps={{
                style: { borderRadius: "8px" },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                alignSelf: "center",
                width: "fit-content",
                paddingX: 4,
                paddingY: 1,
                borderRadius: "8px",
                backgroundColor: "#1e88e5",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
          {error && (
            <Typography
              color="error"
              sx={{ marginTop: 2, textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default MakeRequest;
