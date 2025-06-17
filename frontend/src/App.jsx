import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import UserLoginForm from './pages/Users/LoginForm';
import UserDashboard from './pages/Users/Dashboard';
import UserRegister from './pages/Users/RegisterForm';

function App() {
  const { isLoggedIn, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <UserLoginForm setIsLoggedIn={login} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <UserDashboard setIsLoggedIn={logout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/register"
          element={<UserRegister setIsLoggedIn={login} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;