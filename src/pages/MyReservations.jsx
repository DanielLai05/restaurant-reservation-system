// MyReservations.jsx
import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Row, Col, Button, Badge, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context";
import { reservationAPI, authAPI } from "../services/api";
import { auth } from "../firebase";

export default function MyReservations() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If not logged in, redirect to login
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get token or try to refresh it
        let token = localStorage.getItem('token');

        if (!token && auth.currentUser) {
          try {
            const loginResult = await authAPI.login(auth.currentUser.email);
            if (loginResult.token) {
              localStorage.setItem('token', loginResult.token);
              token = loginResult.token;
            }
          } catch (loginError) {
            if (loginError.message?.includes('User not found')) {
              // Try to sync user
              try {
                await authAPI.syncUser({
                  email: auth.currentUser.email,
                  first_name: auth.currentUser.displayName?.split(' ')[0] || '',
                  last_name: auth.currentUser.displayName?.split(' ')[1] || '',
                  phone: ''
                });
                // Retry login
                const retryResult = await authAPI.login(auth.currentUser.email);
                if (retryResult.token) {
                  localStorage.setItem('token', retryResult.token);
                  token = retryResult.token;
                }
              } catch (syncError) {
                console.error('Sync user failed:', syncError);
              }
            } else if (loginError.message?.includes('Access token required') || loginError.message?.includes('Invalid')) {
              localStorage.removeItem('token');
              navigate("/login");
              return;
            }
          }
        }

        // Now fetch reservations
        const data = await reservationAPI.getUserReservations();
        setReservations(data || []);
      } catch (err) {
        console.error('Error fetching reservations:', err);

        // Handle authentication errors
        if (err.message?.includes('Access token required') || err.message?.includes('Invalid or expired token')) {
          localStorage.removeItem('token');
          navigate("/login");
          return;
        }

        setError(err.message || 'Failed to load reservations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [currentUser, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      case 'completed':
        return <Badge bg="info">Completed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    if (timeStr.includes(':')) {
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    }
    return timeStr;
  };

  const getRestaurantName = (reservation) => {
    if (reservation.restaurant_name) return reservation.restaurant_name;
    return `Restaurant #${reservation.restaurant_id}`;
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="my-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading your reservations...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">My Reservations</h2>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleBackToHome}
          >
            ← Back to Home
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
            <Button variant="link" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Alert>
        )}

        {reservations.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📅</div>
              <h4>No Reservations Yet</h4>
              <p className="text-muted mb-4">
                You haven't made any table reservations yet.
              </p>
              <Button
                style={{ background: "linear-gradient(90deg, #FF7E5F, #FEB47B)", border: "none" }}
                onClick={() => navigate("/home")}
              >
                Make Your First Reservation
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row xs={1} className="g-4">
            {reservations.map((reservation) => (
              <Col key={reservation.id}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{getRestaurantName(reservation)}</span>
                    {getStatusBadge(reservation.status)}
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p className="mb-2">
                          <i className="bi bi-calendar me-2"></i>
                          <strong>Date:</strong> {formatDate(reservation.reservation_date)}
                        </p>
                        <p className="mb-2">
                          <i className="bi bi-clock me-2"></i>
                          <strong>Time:</strong> {formatTime(reservation.reservation_time)}
                        </p>
                        <p className="mb-2">
                          <i className="bi bi-people me-2"></i>
                          <strong>Party Size:</strong> {reservation.party_size} guests
                        </p>
                      </Col>
                      <Col md={6}>
                        {reservation.table_id && (
                          <p className="mb-2">
                            <i className="bi bi-grid me-2"></i>
                            <strong>Table ID:</strong> {reservation.table_id}
                          </p>
                        )}
                        {reservation.special_requests && (
                          <p className="mb-2">
                            <i className="bi bi-chat-left-text me-2"></i>
                            <strong>Notes:</strong> {reservation.special_requests}
                          </p>
                        )}
                        <p className="mb-2">
                          <i className="bi bi-calendar-check me-2"></i>
                          <strong>Booked:</strong> {new Date(reservation.created_at).toLocaleDateString()}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    {reservation.status === 'pending' && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          alert('Cancel reservation feature coming soon!');
                        }}
                      >
                        Cancel Reservation
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}
