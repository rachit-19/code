// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const ProtectedRoute = ({ Component, isAuthenticated, ...rest }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', marginTop: '64px' }}> {/* Adjusted for header height */}
        <Sidebar open={true} />
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <Component {...rest} />
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
