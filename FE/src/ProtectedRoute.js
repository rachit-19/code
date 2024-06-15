// ProtectedRoute.js
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ Component, isAuthenticated, ...rest }) => {
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()
  const currentPath = location.pathname
  if (!isAuthenticated) {
    return <Navigate to="/" />
  }

  if (user.role ==="user" && isAuthenticated && currentPath !== '/raiseDefects') {
    return <Navigate to="/raiseDefects" />
  }


  return (
    <div>
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <Component {...rest} />
        </div>
      </div>
  )
}

export default ProtectedRoute
