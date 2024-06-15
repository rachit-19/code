// src/components/CustomButton.js
import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({ text, onClick }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      {text}
    </Button>
  );
};

export default CustomButton;
