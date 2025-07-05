import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/AnimatedBackground';
import Header from '../../components/Header';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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

      await Swal.fire({
        title: 'Registration Successful!',
        text: 'Your account has been created successfully.',
        icon: 'success',
        confirmButtonText: 'Continue to Login',
        confirmButtonColor: '#8b5cf6',
        allowOutsideClick: false,
        allowEscapeKey: false
      });

      navigate('/');

    } catch (err) {
      console.error('Registration error:', err);

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
    padding: isMobile ? '10px' : '20px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(118, 75, 162, 0.4)',
    padding: isMobile ? '20px' : '24px',
    width: '100%',
    maxWidth: isMobile ? '340px' : '380px',
    position: 'relative',
    zIndex: 10,
    border: '1px solid rgba(147, 51, 234, 0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #d8b4fe',
    backgroundColor: '#faf5ff',
    boxShadow: 'inset 0 1px 2px rgba(147, 51, 234, 0.1)',
    fontSize: '15px',
    transition: 'all 0.2s ease',
    outline: 'none',
    marginBottom: '8px'
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
      <Header />
      <AnimatedBackground>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{
              fontSize: isMobile ? '1.4rem' : '1.8rem',
              fontWeight: 'bold',
              color: '#581c87',
              marginBottom: '6px',
              margin: 0
            }}>Join Daily Digest Now!</h2>
            <div style={{
              width: '56px',
              height: '3px',
              background: 'linear-gradient(to right, #8b5cf6, #a855f7)',
              margin: '6px auto 12px auto',
              borderRadius: '2px'
            }}></div>
            <p style={{
              color: '#7c3aed',
              margin: 0,
              fontSize: isMobile ? '0.85rem' : '0.9rem'
            }}>Create your account</p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fdf2f8',
              color: '#be185d',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '12px',
              fontSize: '13px',
              border: '1px solid #f9a8d4'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontWeight: '500',
                color: '#581c87',
                marginBottom: '4px',
                fontSize: '13px'
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
                  e.target.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.1), inset 0 1px 2px rgba(147, 51, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#faf5ff';
                  e.target.style.borderColor = '#d8b4fe';
                  e.target.style.boxShadow = 'inset 0 1px 2px rgba(147, 51, 234, 0.1)';
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontWeight: '500',
                color: '#581c87',
                marginBottom: '4px',
                fontSize: '13px'
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
                  e.target.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.1), inset 0 1px 2px rgba(147, 51, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#faf5ff';
                  e.target.style.borderColor = '#d8b4fe';
                  e.target.style.boxShadow = 'inset 0 1px 2px rgba(147, 51, 234, 0.1)';
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontWeight: '500',
                color: '#581c87',
                marginBottom: '4px',
                fontSize: '13px'
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{
                    ...inputStyle,
                    paddingRight: '40px'
                  }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.1), inset 0 1px 2px rgba(147, 51, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = '#faf5ff';
                    e.target.style.borderColor = '#d8b4fe';
                    e.target.style.boxShadow = 'inset 0 1px 2px rgba(147, 51, 234, 0.1)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8b5cf6',
                    fontSize: '16px',
                    padding: '2px',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#8b5cf6';
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontWeight: '500',
                color: '#581c87',
                marginBottom: '4px',
                fontSize: '13px'
              }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{
                    ...inputStyle,
                    paddingRight: '40px',
                    borderColor: confirmPassword && password !== confirmPassword ? '#ef4444' : '#d8b4fe'
                  }}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = confirmPassword && password !== confirmPassword ? '#ef4444' : '#8b5cf6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.1), inset 0 1px 2px rgba(147, 51, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = '#faf5ff';
                    e.target.style.borderColor = confirmPassword && password !== confirmPassword ? '#ef4444' : '#d8b4fe';
                    e.target.style.boxShadow = 'inset 0 1px 2px rgba(147, 51, 234, 0.1)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8b5cf6',
                    fontSize: '16px',
                    padding: '2px',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#8b5cf6';
                  }}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '11px',
                  margin: '2px 0 0 0'
                }}>
                  Passwords do not match
                </p>
              )}
            </div>

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
                    width: '18px',
                    height: '18px',
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

            <div style={{
              textAlign: 'center',
              marginTop: '12px'
            }}>
              <small style={{
                color: '#7c3aed',
                fontSize: isMobile ? '0.75rem' : '0.8rem'
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