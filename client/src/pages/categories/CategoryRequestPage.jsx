import React, { useState } from "react";
import axios from "../../api/axiosConfig";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  AppBar,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e88e5",
    },
    secondary: {
      main: "#1565c0",
    },
  },
});

function CategoryRequestPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/categories/request", {
        categoryName: name,
        description: description,
        tags: tags.split(",").map((tag) => tag.trim()),
        requestedBy: "user-id", // replace with actual user id
      })
      .then((response) => {
        alert("Category request submitted!");
        setName("");
        setDescription("");
        setTags("");
      })
      .catch((error) => {
        console.error(
          "There was an error submitting the category request!",
          error
        );
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="transparent" elevation={1} sx={{ padding: 1 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="primary" sx={{ marginRight: 2 }}>
            Home
          </Button>
          <Button color="primary">Categories</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ marginTop: 10 }}>
        <Card
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            Request a New Category
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              sx={{ marginBottom: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                marginTop: 2,
                width: "100%",
                backgroundColor: "#1e88e5",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Submit Request
            </Button>
          </Box>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default CategoryRequestPage;
