import React from "react";
import { Container, Box, Typography } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flexGrow: 1 }}>
        <Header />
        <Container>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to the Admin Dashboard
            </Typography>
            {/* Add your dashboard content here */}
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
