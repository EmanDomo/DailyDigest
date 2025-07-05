import React from 'react';
import AnimatedBackground from '../../components/AnimatedBackground';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HomeImage from '../../assets/home-img.png';
import '../../styles/LandingPage.css';

const App = () => {
  return (
    <AnimatedBackground>
      <Header />

      <Container className="landing-container">
        <Row className="hero-section align-items-center min-vh-100">
          <Col md={6} className="text-center text-md-start">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-text">✨ Health Tracking Made Fun</span>
              </div>
              
              <h1 className="hero-title">
                Welcome to <span className="brand-highlight">Daily Digest</span>
                <span className="poop-emoji">💩</span>
              </h1>
              
              <p className="hero-subtitle">
                Track your digestive health, build healthy habits, and discover insights 
                about your body's natural rhythm—all while having a laugh!
              </p>
              
              <div className="hero-features">
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Monthly Logs</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Daily Tracking</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏆</span>
                  <span>Streak Tracking</span>
                </div>
              </div>
              
              <div className="hero-buttons">
                <Button href="/login" className="cta-primary">
                  Start Your Journey
                  <span className="button-arrow">→</span>
                </Button>
              </div>
            </div>
          </Col>
          
          <Col md={6} className="text-center">
            <div className="hero-image-container">
              
              <img
                src={HomeImage}
                alt="Daily Digest App Interface"
                className="hero-image"
              />
              
              <div className="image-glow"></div>
            </div>
          </Col>
        </Row>
        {/* <Footer /> */}
      </Container>
    </AnimatedBackground>
    
  );
};

export default App;