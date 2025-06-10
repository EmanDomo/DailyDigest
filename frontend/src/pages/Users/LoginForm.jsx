import { useState, useMemo, useEffect } from 'react';

const UserLoginForm = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width <= 768);
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
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success
      if (setIsLoggedIn) setIsLoggedIn(true);
      navigate('/dashboard');
      
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      if (setIsLoggedIn) setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // More responsive wave calculations
const waveProps = useMemo(() => {
  const width = screenWidth;
  const height = isMobile ? (width <= 480 ? 200 : 240) : 120; // Raised from 50->100 and 80->140
  
  return {
    width,
    height,
    // Control points for smooth responsive curves
    cp1x: width * 0.25,
    cp1y: height * 0.2,
    cp2x: width * 0.5,
    cp2y: height * 0.9,
    cp3x: width * 0.75,
    cp3y: height * 0.5,
    cp4x: width * 0.85,
    cp4y: height * 0.25,
    cp5x: width * 0.95,
    cp5y: height * 0.75,
    endX: width,
    endY: height * 0.5
  };
}, [screenWidth, isMobile]);

const poops = useMemo(() => {
  const count = isMobile ? (screenWidth <= 480 ? 6 : 8) : 12;
  const maxWidth = screenWidth;
  
  return Array.from({ length: count }, (_, i) => {
    const direction = Math.random() > 0.5 ? 'right' : 'left';
    const startX = direction === 'right' ? -60 : maxWidth + 60;
    const endX = direction === 'right' ? maxWidth + 60 : -60;
    
    return {
      id: i,
      direction,
      startX,
      endX,
      distance: Math.abs(endX - startX),
      // LOWERED: Mobile poops now positioned between 60-120 (vs desktop 30-60)
      startY: isMobile ? (60 + Math.random() * 60) : (30 + Math.random() * 30),
      fontSize: isMobile ? (screenWidth <= 480 ? 12 + Math.random() * 6 : 14 + Math.random() * 8) : 16 + Math.random() * 12,
      duration: 15 + Math.random() * 10,
      amplitude: isMobile ? 3 + Math.random() * 8 : 5 + Math.random() * 15,
      delay: Math.random() * 8,
      speedVariation: 0.8 + Math.random() * 0.6
    };
  });
}, [screenWidth, isMobile]);

const stationaryPoops = useMemo(() => {
  const count = isMobile ? (screenWidth <= 480 ? 2 : 3) : 6;
  const maxWidth = screenWidth;
  
  return Array.from({ length: count }, (_, i) => ({
    id: `stationary-${i}`,
    x: 50 + Math.random() * (maxWidth - 100),
    // LOWERED: Mobile poops now positioned between 80-130 (vs desktop 40-70)
    y: isMobile ? (80 + Math.random() * 50) : (40 + Math.random() * 30),
    fontSize: isMobile ? (screenWidth <= 480 ? 10 + Math.random() * 4 : 12 + Math.random() * 6) : 14 + Math.random() * 8,
    opacity: 0.3 + Math.random() * 0.4
  }));
}, [screenWidth, isMobile]);

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#5b6ef4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: isMobile ? '20px' : '40px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: isMobile ? '24px' : '32px',
    width: '100%',
    maxWidth: isMobile ? '350px' : '400px',
    position: 'relative',
    zIndex: 10
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    boxShadow: 'inset 0 2px 4px rgb(62 41 255 / 15%)',
    fontSize: '16px', // Prevents zoom on iOS
    transition: 'all 0.2s ease',
    outline: 'none',
    marginBottom: '16px'
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#5b6ef4',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={containerStyle}>
      {/* Particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '8px',
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          animation: 'bounce 2s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '33%',
          right: '25%',
          width: '4px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '33%',
          left: '33%',
          width: isMobile ? '8px' : '12px',
          height: isMobile ? '8px' : '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '33%',
          width: '4px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '50%',
          animation: 'bounce 3s infinite'
        }}></div>
      </div>
      
      {/* Login Card */}
      <div style={cardStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px',
            margin: 0
          }}>Poop Tracker</h2>
          <div style={{
            width: '64px',
            height: '4px',
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            margin: '8px auto 16px auto',
            borderRadius: '2px'
          }}></div>
          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>Sign in to your account</p>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        {/* Form */}
        <div onSubmit={handleSubmit}>
          {/* Username Field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontWeight: '500',
              color: '#1f2937',
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
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), inset 0 2px 4px rgb(62 41 255 / 15%)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'inset 0 2px 4px rgb(62 41 255 / 15%)';
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontWeight: '500',
              color: '#1f2937',
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
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), inset 0 2px 4px rgb(62 41 255 / 15%)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'inset 0 2px 4px rgb(62 41 255 / 15%)';
              }}
            />
          </div>
          
          {/* Submit Button */}
          <button 
            style={buttonStyle}
            onClick={handleSubmit}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#3648c6';
                e.target.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#5b6ef4';
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
              color: '#6b7280',
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}>
              Don't have an account?{' '}
              <a href="/register" style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Register here
              </a>
            </small>
          </div>
        </div>
      </div>
      
      {/* Animated Wave at Bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0
      }}>
        <svg 
          style={{
            position: 'relative',
            display: 'block',
            width: '100%',
            height: `${waveProps.height}px`
          }}
          viewBox={`0 0 ${waveProps.width} ${waveProps.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
            </linearGradient>
          </defs>
          
          {/* Responsive Wave Path */}
          <path 
            d={`M0,${waveProps.endY} C${waveProps.cp1x},${waveProps.cp1y} ${waveProps.cp2x},${waveProps.cp2y} ${waveProps.cp3x},${waveProps.cp3y} C${waveProps.cp4x},${waveProps.cp4y} ${waveProps.cp5x},${waveProps.cp5y} ${waveProps.endX},${waveProps.endY} L${waveProps.endX},${waveProps.height} L0,${waveProps.height} Z`}
            fill="url(#waveGradient)"
          >
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values={`
                M0,${waveProps.endY} C${waveProps.cp1x},${waveProps.cp1y} ${waveProps.cp2x},${waveProps.cp2y} ${waveProps.cp3x},${waveProps.cp3y} C${waveProps.cp4x},${waveProps.cp4y} ${waveProps.cp5x},${waveProps.cp5y} ${waveProps.endX},${waveProps.endY} L${waveProps.endX},${waveProps.height} L0,${waveProps.height} Z;
                M0,${waveProps.endY + 10} C${waveProps.cp1x},${waveProps.cp1y + 15} ${waveProps.cp2x},${waveProps.cp2y - 10} ${waveProps.cp3x},${waveProps.cp3y + 10} C${waveProps.cp4x},${waveProps.cp4y + 8} ${waveProps.cp5x},${waveProps.cp5y - 8} ${waveProps.endX},${waveProps.endY + 10} L${waveProps.endX},${waveProps.height} L0,${waveProps.height} Z;
                M0,${waveProps.endY} C${waveProps.cp1x},${waveProps.cp1y} ${waveProps.cp2x},${waveProps.cp2y} ${waveProps.cp3x},${waveProps.cp3y} C${waveProps.cp4x},${waveProps.cp4y} ${waveProps.cp5x},${waveProps.cp5y} ${waveProps.endX},${waveProps.endY} L${waveProps.endX},${waveProps.height} L0,${waveProps.height} Z
              `}
            />
          </path>
          
          {/* Floating Poop Emojis */}
          {poops.map(poop => (
            <text
              key={poop.id}
              x={poop.startX}
              y={poop.startY}
              fontSize={poop.fontSize}
              textAnchor="middle"
              opacity={0.6 + Math.random() * 0.3}
              style={{
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            >
              💩
              <animateTransform
                attributeName="transform"
                type="translate"
                dur={`${poop.duration / poop.speedVariation}s`}
                repeatCount="indefinite"
                values={`0,0; ${poop.endX - poop.startX},0`}
                keyTimes="0;1"
                begin={`-${poop.delay}s`}
              />
              <animate
                attributeName="y"
                dur={`${3 + Math.random() * 2}s`}
                repeatCount="indefinite"
                values={`
                  ${poop.startY}; 
                  ${poop.startY - poop.amplitude}; 
                  ${poop.startY}; 
                  ${poop.startY + poop.amplitude * 0.6}; 
                  ${poop.startY}
                `}
                keyTimes="0;0.25;0.5;0.75;1"
              />
            </text>
          ))}
          
          {/* Stationary Poops */}
          {stationaryPoops.map(poop => (
            <text
              key={poop.id}
              x={poop.x}
              y={poop.y}
              fontSize={poop.fontSize}
              textAnchor="middle"
              opacity={poop.opacity}
              style={{
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            >
              💩
              <animate
                attributeName="y"
                dur={`${4 + Math.random() * 2}s`}
                values={`
                  ${poop.y}; 
                  ${poop.y - 3}; 
                  ${poop.y + 3}; 
                  ${poop.y}
                `}
                repeatCount="indefinite"
              />
            </text>
          ))}
        </svg>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25%); }
        }

        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserLoginForm;