import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import '../styles/Header.css';

const Header = () => {
    return (
        <Navbar expand="lg" fixed="top" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-logo">
                    <span className="brand-icon">💩</span>
                    <span className="brand-text">Daily Digest</span>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="nav-item">
                            <span className="nav-text">Home</span>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/login" className="nav-item nav-login">
                            <span className="nav-text">Login</span>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;