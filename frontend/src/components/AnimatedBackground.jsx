import { useState, useMemo, useEffect } from 'react';

const AnimatedBackground = ({ children, className = '', style = {} }) => {
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

  // More responsive wave calculations
  const waveProps = useMemo(() => {
    const width = screenWidth;
    const height = isMobile ? (width <= 480 ? 200 : 240) : 120;
    
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
      y: isMobile ? (80 + Math.random() * 50) : (40 + Math.random() * 30),
      fontSize: isMobile ? (screenWidth <= 480 ? 10 + Math.random() * 4 : 12 + Math.random() * 6) : 14 + Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.4
    }));
  }, [screenWidth, isMobile]);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: isMobile ? '20px' : '40px',
    ...style
  };

  return (
    <div style={containerStyle} className={className}>
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
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '50%',
          animation: 'bounce 2s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '33%',
          right: '25%',
          width: '4px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '33%',
          left: '33%',
          width: isMobile ? '8px' : '12px',
          height: isMobile ? '8px' : '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '33%',
          width: '4px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '50%',
          animation: 'bounce 3s infinite'
        }}></div>
      </div>
      
      {/* Content (children) */}
      {children}
      
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
              <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
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

export default AnimatedBackground;