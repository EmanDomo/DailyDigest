import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Button, Alert, Card, Badge,
  Stack, Modal, ListGroup
} from 'react-bootstrap';
import '../../styles/UserDashboard.css';
import poopSoundFile from '../../assets/poopsound.mp3';
import axios from 'axios';
import { API_BASE_URL } from "../../config";

const UserDashboard = ({ setIsLoggedIn }) => {

  // ==================== STATE DECLARATIONS ====================
  const [poopDates, setPoopDates] = useState([]);
  const [daysSinceLastPoop, setDaysSinceLastPoop] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showPoopAnimation, setShowPoopAnimation] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [modifyAction, setModifyAction] = useState('');

  // ==================== CONSTANTS ====================
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // ==================== UTILITY FUNCTIONS ====================
  const getTodayLocal = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  };

  const getDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const playPoopSound = () => {
    const audio = new Audio(poopSoundFile);
    audio.volume = 1;
    audio.play().catch(err => console.log('Audio play failed:', err));
  };

  // ==================== NAVIGATION FUNCTIONS ====================
  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToCurrentMonth = () => {
    setViewMonth(new Date().getMonth());
    setViewYear(new Date().getFullYear());
  };

  // ==================== API FUNCTIONS ====================
  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    // Check if token is expired
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      window.location.href = '/';
      throw new Error('Session expired');
    }

    return response;
  };

  const fetchPoopData = async () => {
    try {
      setLoading(true);

      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/poop-records/get-records`);

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
      if (err.message !== 'Session expired') {
        setError(`Failed to load data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const savePoopRecord = async (date) => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/poop-records/create-record`, {
        method: 'POST',
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
      if (err.message !== 'Session expired') {
        setError(`Failed to save: ${err.message}`);
      }
      throw err;
    }
  };

  const deletePoopRecord = async (date) => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/poop-records/delete-record`, {
        method: 'DELETE',
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
      console.error('Error deleting poop record:', err);
      if (err.message !== 'Session expired') {
        setError(`Failed to delete: ${err.message}`);
      }
      throw err;
    }
  };

  // ==================== CALCULATION FUNCTIONS ====================
  const calculateDaysSinceLastPoop = () => {
    if (poopDates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    // Sort dates in descending order and get the most recent
    const sortedDates = [...poopDates].sort((a, b) => b.localeCompare(a));
    const lastPoopDate = parseLocalDate(sortedDates[0]);
    lastPoopDate.setHours(0, 0, 0, 0); // Reset time to start of day

    // Calculate difference in days
    const diffTime = today.getTime() - lastPoopDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays); // Ensure non-negative
  };

  function getStreakInfo() {
    if (poopDates.length === 0) return { current: 0, longest: 0 };

    const sortedDates = [...poopDates].sort((a, b) => b.localeCompare(a));
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check current streak starting from today
    let checkDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      const checkDateStr = getDateString(checkDate);

      if (sortedDates.includes(checkDateStr)) {
        if (currentStreak === 0 || i === currentStreak) {
          currentStreak++;
        } else {
          break;
        }
      } else if (currentStreak > 0) {
        break;
      }

      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
      const current = parseLocalDate(sortedDates[i]);
      const previous = parseLocalDate(sortedDates[i - 1]);
      const diffDays = Math.abs((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { current: currentStreak, longest: longestStreak };
  }

  // ==================== COMPUTED VALUES (after functions) ====================
  const viewedMonthPoops = poopDates.filter(date =>
    date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`)
  );

  const streakInfo = getStreakInfo();
  const isCurrentMonth = viewMonth === currentMonth && viewYear === currentYear;
  const todayString = getTodayLocal();
  const currentMonthPoops = poopDates.filter(date =>
    date.startsWith(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)
  );
  const handleLogout = async () => {
    try {
      // Optional: skip if your backend doesn't need this
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // ✅ optional
        }
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('authToken'); // ✅ updated key name
      setIsLoggedIn(false); // Optional, depending on your App.jsx
      window.location.href = '/'; // force logout redirect
    }
  };

  const handlePoopToday = async () => {
    const today = getTodayLocal();
    if (!poopDates.includes(today)) {
      try {
        // Play sound and show animation
        playPoopSound();
        setShowPoopAnimation(true);

        // Hide animation after 5 seconds
        setTimeout(() => {
          setShowPoopAnimation(false);
        }, 5000);

        await savePoopRecord(today);
        setPoopDates([today, ...poopDates]);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
      } catch (err) {
        // Error is already handled in savePoopRecord
      }
    }
  };

  const handleModifyPoopDate = () => {
    // Remove the alert and just show the modal with instructions
    setShowModifyModal(true);
    setSelectedDate('');
    setModifyAction('instruction');
  };

  const handleCalendarDayClick = (dateString) => {
    const hasPooped = poopDates.includes(dateString);
    setSelectedDate(dateString);
    setModifyAction(hasPooped ? 'remove' : 'add');
    setShowModifyModal(true);
  };

  const confirmModification = async () => {
    try {
      if (modifyAction === 'add') {
        // Play sound and show animation for past dates too
        playPoopSound();
        setShowPoopAnimation(true);
        setTimeout(() => setShowPoopAnimation(false), 3000);

        await savePoopRecord(selectedDate);
        setPoopDates(prevDates => {
          if (!prevDates.includes(selectedDate)) {
            return [selectedDate, ...prevDates].sort((a, b) => b.localeCompare(a));
          }
          return prevDates;
        });
      } else {
        await deletePoopRecord(selectedDate);
        setPoopDates(prevDates => prevDates.filter(d => d !== selectedDate));
      }

      setShowModifyModal(false);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error('Error modifying record:', err);
      // Error is already handled in the respective functions
    }
  };

  // ==================== RENDER FUNCTIONS ====================
  const renderCalendar = () => {
    const today = new Date();
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const mobileDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Header row
    calendar.push(
      <Row key="headers" className="mb-2 g-0">
        {weekDays.map((day, index) => (
          <Col key={day} className="calendar-header">
            <div className="d-none d-lg-block">{day}</div>
            <div className="d-none d-md-block d-lg-none">{shortDays[index]}</div>
            <div className="d-md-none">{mobileDays[index]}</div>
          </Col>
        ))}
      </Row>
    );

    let currentDate = 1;

    // Build calendar rows (up to 6 weeks)
    for (let week = 0; week < 6; week++) {
      const weekRow = [];

      for (let day = 0; day < 7; day++) {
        const cellIndex = week * 7 + day;
        let dayContent = null;
        let dayClass = 'calendar-day';
        let dateString = '';

        // Add empty cells before the first day of the month
        if (cellIndex < startingDayOfWeek || currentDate > daysInMonth) {
          dayContent = <div className="calendar-day calendar-day-empty"></div>;
        } else {
          dateString = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(currentDate).padStart(2, '0')}`;
          const hasPooped = poopDates.includes(dateString);
          const isToday =
            currentDate === today.getDate() &&
            viewMonth === today.getMonth() &&
            viewYear === today.getFullYear();

          if (hasPooped) dayClass += ' poop-day';
          if (isToday) dayClass += ' today';

          dayContent = (
            <div
              className={dayClass}
              onClick={() => handleCalendarDayClick(dateString)}
            >
              <span className="day-number">{currentDate}</span>
              {hasPooped && <span className="poop-emoji">💩</span>}
            </div>
          );

          currentDate++;
        }

        weekRow.push(
          <Col key={`${week}-${day}`} className="p-1">
            {dayContent}
          </Col>
        );
      }

      // Stop adding weeks if the month is fully rendered
      calendar.push(
        <Row key={`week-${week}`} className="mb-1 g-0">
          {weekRow}
        </Row>
      );

      if (currentDate > daysInMonth) break;
    }

    return calendar;
  };


  // Alternative simplified version if you prefer cleaner layout
  const renderCalendarSimple = () => {
    const today = new Date();
    const firstDay = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Header row
    calendar.push(
      <Row key="headers" className="mb-2">
        {weekDays.map(day => (
          <Col key={day} className="calendar-header">
            <span className="d-none d-sm-inline">{day}</span>
            <span className="d-sm-none">{day.charAt(0)}</span>
          </Col>
        ))}
      </Row>
    );

    let week = [];
    let date = 1;

    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      week.push(
        <Col key={`empty-${i}`} className="p-1">
          <div className="calendar-day calendar-day-empty"></div>
        </Col>
      );
    }

    // Add days of the month
    while (date <= daysInMonth) {
      const dateString = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      const hasPooped = poopDates.includes(dateString);
      const isToday = date === today.getDate() &&
        viewMonth === today.getMonth() &&
        viewYear === today.getFullYear();

      let dayClass = 'calendar-day';
      if (hasPooped) dayClass += ' poop-day';
      if (isToday) dayClass += ' today';

      week.push(
        <Col key={date} className="p-1">
          <div className={dayClass}>
            <span className="day-number">{date}</span>
            {hasPooped && <span className="poop-emoji">💩</span>}
          </div>
        </Col>
      );

      // If week is complete, add it to calendar and start new week
      if (week.length === 7) {
        calendar.push(
          <Row key={`week-${Math.ceil(date / 7)}`} className="mb-1">
            {week}
          </Row>
        );
        week = [];
      }

      date++;
    }

    // Fill remaining cells in the last week if needed
    while (week.length > 0 && week.length < 7) {
      week.push(
        <Col key={`empty-end-${week.length}`} className="p-1">
          <div className="calendar-day calendar-day-empty"></div>
        </Col>
      );
    }

    // Add the last week if it has content
    if (week.length > 0) {
      calendar.push(
        <Row key={`week-final`} className="mb-1">
          {week}
        </Row>
      );
    }

    return calendar;
  };

  // Poop Animation Component
  const PoopAnimation = () => {
    const poops = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      duration: 1.5 + Math.random() * 3,
      left: Math.random() * 100,
      size: 15 + Math.random() * 25
    }));

    return (
      <div className="poop-animation-container">
        {poops.map(poop => (
          <div
            key={poop.id}
            className="falling-poop"
            style={{
              left: `${poop.left}%`,
              animationDelay: `${poop.delay}s`,
              animationDuration: `${poop.duration}s`,
              fontSize: `${poop.size}px`
            }}
          >
            💩
          </div>
        ))}
      </div>
    );
  };

  // ==================== EFFECTS ====================
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Only fetch data when user is available (passed from App.jsx)
    if (user && user.id) {
      console.log('✅ User available, fetching poop data:', user);
      fetchPoopData();
    } else {
      console.log('⏳ Waiting for user data...');
    }
  }, [user]); // Depend on the user prop from App.jsx

  useEffect(() => {
    fetchPoopData();
  }, []);

  // Update days since last poop whenever poopDates changes
  useEffect(() => {
    setDaysSinceLastPoop(calculateDaysSinceLastPoop());
  }, [poopDates]);

  // ==================== EARLY RETURNS ====================
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

  return (
    <Container fluid className="dashboard-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {showPoopAnimation && <PoopAnimation />}

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
                  <>Welcome to Daily Digest Dashboard, {user.name}!</>
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
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <Card className="action-card">
              <Card.Body className="text-center">
                <h3 className="mb-3 action-title">
                  Did you poop today? 😏💩👀
                </h3>

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

          <Col xs={12} md={6}>
            <Card className="action-card">
              <Card.Body className="text-center">
                <h3 className="mb-3 action-title">
                  Modify Calendar 📅📝
                </h3>

                <Button
                  size="lg"
                  className="poop-button"
                  onClick={handleModifyPoopDate}
                >
                  <span className="me-2">📝</span>
                  Modify Dates
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
                  <div className="d-flex align-items-center">
                    <h4 className="mb-0 text-white me-3">
                      <span className="me-2">📅</span>
                      {monthNames[viewMonth]} {viewYear}
                    </h4>
                    <div className="month-navigation">
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={goToPreviousMonth}
                        className="me-2"
                        disabled={viewMonth === currentMonth - 1 && viewYear === currentYear}
                      >
                        ← Previous
                      </Button>
                      {!isCurrentMonth && (
                        <Button
                          variant="outline-light"
                          size="sm"
                          onClick={goToCurrentMonth}
                          className="me-2"
                        >
                          Current Month
                        </Button>
                      )}
                    </div>
                  </div>
                  {/* <Button
      variant="outline-light"
      size="sm"
      onClick={() => setShowCalendar(!showCalendar)}
      className="calendar-toggle"
    >
      {showCalendar ? 'Hide' : 'Show'} Calendar
    </Button> */}
                </Stack>
              </Card.Header>
              <Card.Body>
                {showCalendar ? (
                  <>
                    <div className="calendar">
                      {renderCalendarSimple()}
                    </div>
                    {/* <div className="calendar-legend">
                      <div className="legend-item">
                        <div className="legend-color poop-legend"></div>
                        <span className="legend-text">Poop Day</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color today-legend"></div>
                        <span className="legend-text">Today</span>
                      </div>
                    </div> */}
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
                  {isCurrentMonth ? "This Month's Stats" : `${monthNames[viewMonth]} ${viewYear} Stats`}
                </h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="stats-item">
                    <span className="stats-label">Total Poops:</span>
                    <Badge className="stats-badge" pill>
                      {viewedMonthPoops.length}
                    </Badge>
                  </ListGroup.Item>

                  <ListGroup.Item className="stats-item">
                    <span className="stats-label">Average per Week:</span>
                    <Badge className="stats-badge-alt" pill>
                      {Math.round((viewedMonthPoops.length / 4) * 10) / 10}
                    </Badge>
                  </ListGroup.Item>

                  <ListGroup.Item className="stats-item">
                    <span className="stats-label">Days in Month:</span>
                    <Badge className="stats-badge-alt2" pill>
                      {new Date(viewYear, viewMonth + 1, 0).getDate()}
                    </Badge>
                  </ListGroup.Item>
                </ListGroup>

                <hr className="stats-divider" />
                <h6 className="recent-title">Activity in {monthNames[viewMonth]}</h6>
                <div className="small">
                  {viewedMonthPoops.slice(0, 5).map((date, index) => (
                    <div key={index} className="recent-item">
                      <span className="me-2">💩</span>
                      <span className="recent-date">{new Date(date + 'T00:00:00').toLocaleDateString()}</span>
                    </div>
                  ))}
                  {viewedMonthPoops.length === 0 && (
                    <p className="no-activity">No activity in this month</p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal show={showModifyModal} onHide={() => setShowModifyModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {modifyAction === 'instruction' ? 'Modify Poop Records' :
                modifyAction === 'add' ? 'Add Poop Record' : 'Remove Poop Record'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modifyAction === 'instruction' ? (
              <div>
                {/* Instructions */}
                <div className="text-center mb-4">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅💩</div>
                  <p className="mb-3">
                    <strong>Instructions:</strong><br />
                    Click on any day in the calendar to add or remove a poop record for that date.
                  </p>
                  <ul className="text-start">
                    <li>Days with 💩 emoji have existing records - click to remove</li>
                    <li>Empty days - click to add a new record</li>
                    <li>Today is highlighted with a border</li>
                  </ul>
                </div>

                {/* Calendar */}
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {renderCalendar()}
                </div>
              </div>
            ) : (
              <div>
                <p>
                  {modifyAction === 'add'
                    ? `Add a poop record for ${selectedDate}?`
                    : `Remove the poop record for ${selectedDate}?`
                  }
                </p>
                <div className="text-center my-3">
                  <span style={{ fontSize: '3rem' }}>
                    {modifyAction === 'add' ? '➕💩' : '❌💩'}
                  </span>
                </div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            {modifyAction === 'instruction' ? (
              <Button variant="primary" onClick={() => setShowModifyModal(false)}>
                Got it!
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setShowModifyModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant={modifyAction === 'add' ? 'success' : 'danger'}
                  onClick={confirmModification}
                >
                  {modifyAction === 'add' ? 'Add Record' : 'Remove Record'}
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>

      </Container>

      <style jsx>{`
        .poop-animation-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }
        
        .falling-poop {
          position: absolute;
          top: -50px;
          animation: fall linear infinite;
          pointer-events: none;
        }
        
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
            opacity: 0.5;
          }
        }
        
        .poop-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .poop-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        
        .poop-button:active:not(:disabled) {
          transform: scale(0.95);
        }
      `}</style>
    </Container>
  );
};

export default UserDashboard;