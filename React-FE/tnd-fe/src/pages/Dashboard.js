// src/pages/Dashboard.js
import React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  Button,
} from "@mui/material";
import CustomTable from "../components/CustomTable";

const Dashboard = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get("name"),
      description: data.get("description"),
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sample Form
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="description"
                label="Description"
                id="description"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Paper>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <CustomTable />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
