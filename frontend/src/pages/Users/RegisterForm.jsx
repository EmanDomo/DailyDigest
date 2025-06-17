import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import AnimatedBackground from '../../components/AnimatedBackground';
import Swal from 'sweetalert2';
import { API_BASE_URL } from "../../config";

const UserRegisterForm = ({ setIsLoggedIn }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const navigate = useNavigate(); // Replace the mock navigate function with this

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Success - show SweetAlert
      await Swal.fire({
        title: 'Registration Successful!',
        text: 'Your account has been created successfully.',
        icon: 'success',
        confirmButtonText: 'Continue to Login',
        confirmButtonColor: '#8b5cf6',
        allowOutsideClick: false,
        allowEscapeKey: false
      });

      // Navigate to login page after clicking OK
      navigate('/'); // This will now work properly
      
    } catch (err) {
      console.error('Registration error:', err);
      
      // Error - show SweetAlert
      await Swal.fire({
        title: 'Registration Failed',
        text: err.message || 'Registration failed. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#ef4444'
      });
      
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: isMobile ? '20px' : '40px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 25px 50px -12px rgba(118, 75, 162, 0.4)',
    padding: isMobile ? '24px' : '32px',
    width: '100%',
    maxWidth: isMobile ? '350px' : '400px',
    position: 'relative',
    zIndex: 10,
    border: '1px solid rgba(147, 51, 234, 0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d8b4fe',
    backgroundColor: '#faf5ff',
    boxShadow: 'inset 0 2px 4px rgba(147, 51, 234, 0.1)',
    fontSize: '16px', // Prevents zoom on iOS
    transition: 'all 0.2s ease',
    outline: 'none',
    marginBottom: '16px'
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <AnimatedBackground>
        {/* Register Card */}
        <div style={cardStyle}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{
              fontSize: isMobile ? '1.5rem' : '2rem',
              fontWeight: 'bold',
              color: '#581c87',
              marginBottom: '8px',
              margin: 0
            }}>Join Poop Tracker</h2>
            <div style={{
              width: '64px',
              height: '4px',
              background: 'linear-gradient(to right, #8b5cf6, #a855f7)',
              margin: '8px auto 16px auto',
              borderRadius: '2px'
            }}></div>
            <p style={{
              color: '#7c3aed',
              margin: 0,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>Create your account</p>
          </div>
          
          {/* Error Alert */}
          {error && (
            <div style={{
              backgroundColor: '#fdf2f8',
              color: '#be185d',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              border: '1px solid #f9a8d4'
            }}>
              {error}
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontWeight: '500',
                color: '#581c87',
                marginBottom: '8px',
                fontSize: '14px'
              }}>Full Name</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1), inset 0 2px 4px rgba(147, 51, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#faf5ff';
                  e.target.style.borderColor = '#d8b4fe';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(147, 51, 234, 0.1)';
                }}
              />
            </div>

            {/* Username Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontWeight: '500',
                color: '#581c87',
                marginBottom: '8px',
                fontSize: '14px'
              }}>Username</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1), inset 0 2px 4px rgba(147, 51, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#faf5ff';
                  e.target.style.borderColor = '#d8b4fe';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(147, 51, 234, 0.1)';
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontWeight: '500',
                color: '#581c87',
                marginBottom: '8px',
                fontSize: '14px'
              }}>Password</label>
              <input
                style={inputStyle}
                type="password"  
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1), inset 0 2px 4px rgba(147, 51, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#faf5ff';
                  e.target.style.borderColor = '#d8b4fe';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(147, 51, 234, 0.1)';
                }}
              />
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontWeight: '500',
                color: '#581c87',
                marginBottom: '8px',
                fontSize: '14px'
              }}>Confirm Password</label>
              <input
                style={{
                  ...inputStyle,
                  borderColor: confirmPassword && password !== confirmPassword ? '#ef4444' : '#d8b4fe'
                }}
                type="password"  
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = confirmPassword && password !== confirmPassword ? '#ef4444' : '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1), inset 0 2px 4px rgba(147, 51, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#faf5ff';
                  e.target.style.borderColor = confirmPassword && password !== confirmPassword ? '#ef4444' : '#d8b4fe';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(147, 51, 234, 0.1)';
                }}
              />
              {confirmPassword && password !== confirmPassword && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  margin: '4px 0 0 0'
                }}>
                  Passwords do not match
                </p>
              )}
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit"
              style={buttonStyle}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';
                  e.target.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }}></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
            
            {/* Login Link */}
            <div style={{
              textAlign: 'center',
              marginTop: '16px'
            }}>
              <small style={{
                color: '#7c3aed',
                fontSize: isMobile ? '0.8rem' : '0.875rem'
              }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  style={{
                    color: '#8b5cf6',
                    textDecoration: 'none',
                    fontWeight: '500',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: 'inherit'
                  }}
                >
                  Sign in here
                </button>
              </small>
            </div>
          </form>
        </div>
      </AnimatedBackground>
    </>
  );
};

export default UserRegisterForm;