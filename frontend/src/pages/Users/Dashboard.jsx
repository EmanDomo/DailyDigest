import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Button, Alert, Card, Badge,
  Stack, Modal, ListGroup
} from 'react-bootstrap';
import '../../styles/UserDashboard.css';
import axios from 'axios';

const UserDashboard = ({ setIsLoggedIn }) => {
  const [poopDates, setPoopDates] = useState([]);
  const [daysSinceLastPoop, setDaysSinceLastPoop] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/auth/user', { withCredentials: true }) // 👈 must include this to send cookies
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.log('Not logged in', err);
      });
  }, []);

  // Fetch poop data from backend
  const fetchPoopData = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:8000/api/poop-records', {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // IMPORTANT: Include cookies
      });

      console.log('Response status:', response.status);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server returned ${contentType || 'unknown content type'} instead of JSON`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setPoopDates(data.dates);
      setError(null);
    } catch (err) {
      console.error('Error fetching poop data:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save poop record to backend
  const savePoopRecord = async (date) => {
    try {
      const response = await fetch('http://localhost:8000/api/poop-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // IMPORTANT: Include cookies
        body: JSON.stringify({ date })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server returned ${contentType || 'unknown content type'} instead of JSON`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Error saving poop record:', err);
      setError(`Failed to save: ${err.message}`);
      throw err;
    }
  };

  useEffect(() => {
    fetchPoopData();
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear server-side cookie
      await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // IMPORTANT: Include cookies
      });

      // Remove any remaining localStorage items (cleanup)
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    } catch (err) {
      console.error('Logout error:', err);
      // Even if logout fails, still log out on frontend
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  };

  const handlePoopToday = async () => {
    const today = new Date().toISOString().split('T')[0];
    if (!poopDates.includes(today)) {
      try {
        await savePoopRecord(today);
        setPoopDates([today, ...poopDates]);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } catch (err) {
        // Error is already handled in savePoopRecord
      }
    }
  };

  const calculateDaysSinceLastPoop = () => {
    if (poopDates.length === 0) return 0;

    const today = new Date();
    const lastPoopDate = new Date(Math.max(...poopDates.map(date => new Date(date))));
    const diffTime = today - lastPoopDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    setDaysSinceLastPoop(calculateDaysSinceLastPoop());
  }, [poopDates]);

  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    calendar.push(
      <Row key="headers" className="text-center mb-2">
        {weekDays.map(day => (
          <Col key={day} className="calendar-header">
            {day}
          </Col>
        ))}
      </Row>
    );

    let week = [];
    let dayCounter = 1;

    for (let i = 0; i < startingDayOfWeek; i++) {
      week.push(<Col key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasPooped = poopDates.includes(dateString);
      const isToday = day === today.getDate();

      week.push(
        <Col key={day} className="p-1">
          <div className={`calendar-day ${hasPooped ? 'poop-day' : ''} ${isToday ? 'today' : ''}`}>
            <span className="small fw-bold">{day}</span>
            {hasPooped && <span className="ms-1">💩</span>}
          </div>
        </Col>
      );

      if (week.length === 7) {
        calendar.push(
          <Row key={`week-${dayCounter}`} className="mb-1">
            {week}
          </Row>
        );
        week = [];
        dayCounter++;
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(<Col key={`empty-end-${week.length}`} />);
      }
      calendar.push(
        <Row key={`week-${dayCounter}`} className="mb-1">
          {week}
        </Row>
      );
    }

    return calendar;
  };

  const getStreakInfo = () => {
    if (poopDates.length === 0) return { current: 0, longest: 0 };

    const sortedDates = [...poopDates].sort((a, b) => new Date(b) - new Date(a));
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    let checkDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        currentStreak++;
      } else if (currentStreak > 0) {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i]);
      const previous = new Date(sortedDates[i - 1]);
      const diffDays = Math.abs((previous - current) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { current: currentStreak, longest: longestStreak };
  };

  if (loading) {
    return (
      <Container fluid className="dashboard-container">
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your poop data...</p>
          </div>
        </Container>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="dashboard-container">
        <Container>
          <Alert variant="danger" className="mt-4">
            <Alert.Heading>Error Loading Data</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={fetchPoopData}>
              Try Again
            </Button>
          </Alert>
        </Container>
      </Container>
    );
  }

  const streakInfo = getStreakInfo();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();
  const todayString = new Date().toISOString().split('T')[0];
  const currentMonthPoops = poopDates.filter(date =>
    date.startsWith(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)
  );

  return (
    <Container fluid className="dashboard-container">
      <Container>
        {showSuccessAlert && (
          <Alert
            variant="success"
            className="success-alert"
            onClose={() => setShowSuccessAlert(false)}
            dismissible
          >
            <strong>Great job! 💩</strong> Today's poop has been recorded!
          </Alert>
        )}

        <Row className="mb-4">
          <Col>
            <Stack direction="horizontal" className="justify-content-between align-items-center">
              <h1 className="dashboard-title">
                <span className="me-2">💩</span>
                {user ? (
                  <>Welcome to Poop Tracker Dashboard, {user.username}</>
                ) : (
                  <>Loading...</>
                )}
              </h1>

              <Button
                variant="outline-primary"
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </Button>
            </Stack>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  {daysSinceLastPoop === 0 ? '🎉' : '⏰'}
                </div>
                <Card.Title className="stat-title">Days Since Last Poop</Card.Title>
                <div className="stat-number">{daysSinceLastPoop}</div>
                {daysSinceLastPoop === 0 && (
                  <Badge className="success-badge">You pooped today!</Badge>
                )}
                {daysSinceLastPoop >= 3 && (
                  <Badge className="warning-badge">Time to go!</Badge>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">🔥</div>
                <Card.Title className="stat-title">Current Streak</Card.Title>
                <div className="stat-number">{streakInfo.current}</div>
                <small className="stat-subtitle">consecutive days</small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">🏆</div>
                <Card.Title className="stat-title">Longest Streak</Card.Title>
                <div className="stat-number">{streakInfo.longest}</div>
                <small className="stat-subtitle">days in a row</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Card className="action-card">
              <Card.Body className="text-center">
                <h3 className="mb-3 action-title">Did you poop today?</h3>
                <Button
                  size="lg"
                  className={`poop-button ${poopDates.includes(todayString) ? 'disabled' : ''}`}
                  onClick={handlePoopToday}
                  disabled={poopDates.includes(todayString)}
                >
                  <span className="me-2">💩</span>
                  {poopDates.includes(todayString)
                    ? "Already recorded for today!"
                    : "I Pooped Today!"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={8} className="mb-4">
            <Card className="calendar-card">
              <Card.Header className="calendar-header-bg">
                <Stack direction="horizontal" className="justify-content-between">
                  <h4 className="mb-0 text-white">
                    <span className="me-2">📅</span>
                    {currentMonth} {currentYear}
                  </h4>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="calendar-toggle"
                  >
                    {showCalendar ? 'Hide' : 'Show'} Calendar
                  </Button>
                </Stack>
              </Card.Header>
              <Card.Body>
                {showCalendar ? (
                  <>
                    <div className="calendar">
                      {renderCalendar()}
                    </div>
                    <div className="calendar-legend">
                      <div className="legend-item">
                        <div className="legend-color poop-legend"></div>
                        <span className="legend-text">Poop Day</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color today-legend"></div>
                        <span className="legend-text">Today</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="calendar-hidden">
                    Calendar is hidden
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="mb-4">
            <Card className="stats-card">
              <Card.Header className="stats-header-bg">
                <h5 className="mb-0 text-white">
                  <span className="me-2">📊</span>
                  This Month's Stats
                </h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="stats-item">
                    <span className="stats-label">Total Poops:</span>
                    <Badge className="stats-badge" pill>
                      {currentMonthPoops.length}
                    </Badge>
                  </ListGroup.Item>

                  <ListGroup.Item className="stats-item">
                    <span className="stats-label">Average per Week:</span>
                    <Badge className="stats-badge-alt" pill>
                      {Math.round((currentMonthPoops.length / 4) * 10) / 10}
                    </Badge>
                  </ListGroup.Item>

                  <ListGroup.Item className="stats-item">
                    <span className="stats-label">Days This Month:</span>
                    <Badge className="stats-badge-alt2" pill>
                      {new Date().getDate()}
                    </Badge>
                  </ListGroup.Item>
                </ListGroup>

                <hr className="stats-divider" />
                <h6 className="recent-title">Recent Activity</h6>
                <div className="small">
                  {poopDates.slice(0, 5).map((date, index) => (
                    <div key={index} className="recent-item">
                      <span className="me-2">💩</span>
                      <span className="recent-date">{new Date(date).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {poopDates.length === 0 && (
                    <p className="no-activity">No activity yet</p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default UserDashboard;