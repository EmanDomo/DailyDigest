import { useState, useEffect } from 'react';
import AnimatedBackground from '../../components/AnimatedBackground';

const UserLoginForm = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock navigate function for demo
  const navigate = (path) => console.log(`Navigating to: ${path}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // IMPORTANT: Include cookies
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      
      // Remove localStorage token storage
      if (setIsLoggedIn) setIsLoggedIn(true);
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Login error:', err);
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
          }}>Poop Tracker</h2>
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
            <input
              style={inputStyle}
              type="password"  
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
        </form>
      </div>
    </AnimatedBackground>
  );
};

export default UserLoginForm;