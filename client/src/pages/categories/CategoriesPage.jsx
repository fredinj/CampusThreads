import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar/Navbar';
import LoadingIndicator from "../../components/ui/LoadingIndicator";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Alert } from "@mui/material";

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
    navigate('/approve-request');
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
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) return <Alert severity="error" className="text-center">{`Error: ${error}`}</Alert>;

  return (
    <div className="w-full min-h-full p-5">
      {/* <Navbar home={true} categories={false} /> */}

      {loadingCategories ? (
        <div className="flex flex-col items-center justify-center w-full">
          <LoadingIndicator />
        </div>
      ) : (
        <div className="w-[50rem] mx-auto flex flex-col items-center mt-10">
          <div className="w-full flex items-center justify-between mb-5">
            <Typography variant="h4" className="font-semibold">
              Categories
            </Typography>
            <div className="flex space-x-3">
              {(user.role === "teacher" || user.role === "admin") && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={navigateToMakeRequest}
                >
                  Make Request
                </Button>
              )}
              {user.role === 'admin' && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={navigateToApproveRequest}
                >
                  View Requests
                </Button>
              )}
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {categories.map((category, index) => (
                <Card
                  key={category._id}
                  className="w-full shadow-lg transform transition-transform duration-200 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent>
                    <Typography variant="h6" className="mb-2">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-4">
                      {category.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/category/${category._id}`)}
                      className="w-full"
                    >
                      Explore More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Typography variant="body1" color="textSecondary" className="text-center">
              No categories found.
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
