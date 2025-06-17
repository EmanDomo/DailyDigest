// // hooks/useAuth.js
// import { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import { API_BASE_URL } from "../config";

// export const useAuth = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   const validateToken = async () => {
//     const token = Cookies.get('authToken');
//     if (!token) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//         setIsLoggedIn(true);
//       } else {
//         // Token is invalid, remove it
//         Cookies.remove('authToken');
//         setIsLoggedIn(false);
//         setUser(null);
//       }
//     } catch (error) {
//       console.error('Token validation failed:', error);
//       Cookies.remove('authToken');
//       setIsLoggedIn(false);
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     validateToken();
//   }, []);

//   const login = (userData = null) => {
//     setIsLoggedIn(true);
//     if (userData) {
//       setUser(userData);
//     } else {
//       // If no user data provided, validate token to get user info
//       validateToken();
//     }
//   };

//   const logout = async () => {
//     try {
//       // Call logout endpoint
//       await fetch(`${API_BASE_URL}/api/auth/logout`, {
//         method: 'POST',
//         credentials: 'include'
//       });
//     } catch (error) {
//       console.error('Logout API call failed:', error);
//     } finally {
//       // Always clear local state regardless of API call success
//       Cookies.remove('authToken', { path: '/' });
//       Cookies.remove('authToken'); // Remove without path as well
//       localStorage.removeItem('token'); // Remove any localStorage token too
//       setIsLoggedIn(false);
//       setUser(null);
//     }
//   };

//   return { isLoggedIn, isLoading, user, login, logout };
// };