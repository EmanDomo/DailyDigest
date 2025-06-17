import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import UserLoginForm from './pages/Users/LoginForm'
import UserDashboard from './pages/Users/Dashboard'
import UserRegister from './pages/Users/RegisterForm'

// Your API configuration
const useProduction = true;
export const API_BASE_URL = useProduction
  ? "https://dailydigest.onrender.com"
  : "http://localhost:8000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [user, setUser] = useState(null)

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking auth status...');
      console.log('🍪 Current cookies:', document.cookie);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📨 Auth check response:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User authenticated:', userData);
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        console.log('❌ User not authenticated - this is normal if not logged in');
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Function to handle successful login
  const handleLoginSuccess = async (userData) => {
    console.log('🎉 Login successful, updating app state:', userData);
    setUser(userData);
    setIsLoggedIn(true);
    
    // Optional: Re-check auth status after login to ensure consistency
    // await checkAuthStatus();
  };

  // Function to handle logout
  const handleLogout = () => {
    console.log('👋 Logging out...');
    setUser(null);
    setIsLoggedIn(false);
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isLoggedIn ? (
              <UserLoginForm 
                setIsLoggedIn={setIsLoggedIn} 
                onLoginSuccess={handleLoginSuccess}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route 
          path="/register" 
          element={
            !isLoggedIn ? (
              <UserRegister />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route 
          path="/dashboard" 
          element={
            isLoggedIn ? (
              <UserDashboard 
                setIsLoggedIn={setIsLoggedIn} 
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App