import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/Footer.css";

const Footer = () => {
    return (
             <footer className="landing-footer">
        <Container>
          <Row>
            <Col className="text-center">
              <p className="footer-attribution">
                Created with ❤️ by <span className="creator-name">Eman Domoos</span>
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    );
};

export default Footer