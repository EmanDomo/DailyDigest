import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AnimatedBackground from '../../components/AnimatedBackground';
import { API_BASE_URL } from "../../config";
import { useNavigate } from 'react-router-dom';

function UserLoginForm({ setIsLoggedIn, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock navigate function for demo

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    console.log('🔐 Attempting login to:', `${API_BASE_URL}/api/auth/login`);

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log('📨 Response status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    console.log('✅ Login successful:', data);

    // ✅ Store token in localStorage
    localStorage.setItem('authToken', data.token);

    await Swal.fire({
      icon: 'success',
      title: 'Login Successful!',
      confirmButtonText: 'Continue',
      confirmButtonColor: '#8b5cf6',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      customClass: {
        popup: 'swal-success-popup'
      }
    });

    // Optional: If you're using onLoginSuccess or setIsLoggedIn
    // In your handleSubmit function after successful login:
if (onLoginSuccess) {
  onLoginSuccess(data.user);
} else if (setIsLoggedIn) {
  setIsLoggedIn(true); // This will trigger the re-render
}

    navigate('/dashboard');

  } catch (err) {
    console.error('❌ Login error:', err);

    await Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: err.message || 'Please check your credentials and try again.',
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#8b5cf6',
      customClass: {
        popup: 'swal-error-popup'
      }
    });

    setError(err.message || 'Login failed. Please check your credentials.');
    if (setIsLoggedIn) setIsLoggedIn(false);

  } finally {
    setIsLoading(false);
  }
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
      {/* Custom SweetAlert2 Styles */}
      <style jsx>{`
        .swal-success-popup {
          border-left: 4px solid #10b981 !important;
        }
        .swal-error-popup {
          border-left: 4px solid #ef4444 !important;
        }
        .swal2-toast {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
      `}</style>

      <AnimatedBackground>
        {/* Login Card */}
        <div style={cardStyle}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{
              fontSize: isMobile ? '1.5rem' : '2rem',
              fontWeight: 'bold',
              color: '#581c87',
              marginBottom: '8px',
              margin: 0
            }}>Daily Digest</h2>
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
            }}>Sign in to your account</p>
          </div>
          
          {/* Error Alert - Keep as fallback */}
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
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            {/* Password Field */}
            <div style={{ marginBottom: '24px' }}>
  <label style={{
    display: 'block',
    fontWeight: '500',
    color: '#581c87',
    marginBottom: '8px',
    fontSize: '14px'
  }}>Password</label>
  <div style={{ position: 'relative' }}>
    <input
      style={{
        ...inputStyle,
        paddingRight: '45px' // Make room for the eye icon
      }}
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
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
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: 'absolute',
        right: '12px',
        top: '12px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#8b5cf6',
        fontSize: '18px',
        padding: '4px',
        width: '24px',
        height: '24px',
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
            
            {/* Register Link */}
            <div style={{
              textAlign: 'center',
              marginTop: '16px'
            }}>
              <small style={{
                color: '#7c3aed',
                fontSize: isMobile ? '0.8rem' : '0.875rem'
              }}>
                Don't have an account?{' '}
                <a href="/register" style={{
                  color: '#8b5cf6',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  Register here
                </a>
              </small>
            </div>
            {/* Developer Credit */}
<div style={{
  textAlign: 'center',
  marginTop: '12px',
  paddingTop: '12px'
}}>
  <small style={{
    color: '#a855f7',
    fontSize: '0.75rem',
    opacity: 0.7
  }}>
    by Eman Domoos 👋
  </small>
</div>
          </form>
        </div>
      </AnimatedBackground>
    </>
  );
};

export default UserLoginForm;