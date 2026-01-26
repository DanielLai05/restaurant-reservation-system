// OrderConfirmation.jsx
import React, { useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { formatPrice } from "../utils/formatters";
import { AppContext } from "../context/AppContext";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(AppContext);
  const cartCleared = useRef(false);

  // Safely get state - handle null/undefined
  const state = location.state || {};
  const order = state.order || null;
  const reservation = state.reservation || null;
  const message = state.message || "Your order has been placed successfully!";
  const cart = state.cart || [];

  // Clear cart only once when component mounts
  React.useEffect(() => {
    if (cart && cart.length > 0 && !cartCleared.current) {
      cartCleared.current = true;
      clearCart();
    }
  }, [cart, clearCart]);

  // If no order/reservation data, show error
  if (!order && !reservation) {
    return (
      <>
        <Navbar />
        <Container className="my-5 text-center">
          <Alert variant="warning">
            <h4>No Confirmation Data</h4>
            <p>We couldn't find your order or reservation details.</p>
          </Alert>
          <Button
            style={{ background: "linear-gradient(90deg, #FF7E5F, #FEB47B)", border: "none" }}
            onClick={() => navigate("/home")}
          >
            Go to Home
          </Button>
        </Container>
      </>
    );
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  // Helper to format date
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

  // Helper to format time
  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    try {
      let hours, minutes;
      if (typeof timeStr === 'string' && timeStr.includes('T')) {
        const date = new Date(timeStr);
        hours = date.getHours();
        minutes = date.getMinutes();
      } else if (typeof timeStr === 'string' && timeStr.includes(':')) {
        const parts = timeStr.split(':');
        hours = parseInt(parts[0]);
        minutes = parseInt(parts[1]);
      } else {
        return timeStr;
      }
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h12 = hours % 12 || 12;
      const minStr = minutes.toString().padStart(2, '0');
      return `${h12}:${minStr} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  // Navigate to home
  const handleBackToHome = () => {
    navigate("/home");
  };

  // Navigate to my reservations
  const handleViewReservations = () => {
    navigate("/my-reservations");
  };

  return (
    <>
      <Navbar />
      <Container className="my-5">
        {/* Success Message */}
        <div className="text-center mb-5">
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <i className="bi bi-check-lg text-white" style={{ fontSize: "2.5rem" }}></i>
          </div>
          <h2 className="fw-bold text-success">Booking Confirmed!</h2>
          <p className="text-muted">{message}</p>
        </div>

        {/* Reservation Details */}
        {reservation && (
          <Row className="justify-content-center mb-4">
            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Header style={{ background: "linear-gradient(90deg, #FF7E5F, #FEB47B)", color: "white", border: "none" }}>
                  <Card.Title className="mb-0">Reservation Details</Card.Title>
                </Card.Header>
                <Card.Body>
                  {reservation.restaurant_name && (
                    <p><strong>Restaurant:</strong> {reservation.restaurant_name}</p>
                  )}
                  {reservation.restaurant && !reservation.restaurant_name && (
                    <p><strong>Restaurant:</strong> {reservation.restaurant}</p>
                  )}
                  <p><strong>Date:</strong> {formatDate(reservation.reservation_date || reservation.date)}</p>
                  <p><strong>Time:</strong> {formatTime(reservation.reservation_time || reservation.time)}</p>
                  <p><strong>Party Size:</strong> {reservation.party_size || reservation.partySize} guests</p>
                  <p><strong>Status:</strong>
                    <span className="badge bg-warning text-dark ms-2">{reservation.status}</span>
                  </p>
                  {reservation.special_requests && (
                    <p><strong>Special Requests:</strong> {reservation.special_requests}</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Order Details */}
        {order && (
          <Row className="justify-content-center mb-4">
            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Header style={{ background: "linear-gradient(90deg, #FF7E5F, #FEB47B)", color: "white", border: "none" }}>
                  <Card.Title className="mb-0">Order Details</Card.Title>
                </Card.Header>
                <Card.Body>
                  <p><strong>Order ID:</strong> #{order.id}</p>
                  <p><strong>Total:</strong> {formatPrice(order.total_amount || 0)}</p>
                  <p><strong>Status:</strong>
                    <span className="badge bg-warning text-dark ms-2">{order.status}</span>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Cart Items (if any) */}
        {cart && cart.length > 0 && (
          <Row className="justify-content-center mb-4">
            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Header>
                  <Card.Title className="mb-0">Order Summary</Card.Title>
                </Card.Header>
                <Card.Body>
                  {cart.map((item, idx) => (
                    <div key={idx} className="d-flex justify-content-between mb-2">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{formatPrice((item.price || 0) * (item.quantity || 0))}</span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Actions */}
        <div className="text-center mt-4">
          <Button
            variant="primary"
            className="me-3"
            style={{
              background: "linear-gradient(90deg, #FF7E5F, #FEB47B)",
              border: "none",
              cursor: "pointer"
            }}
            onClick={handleBackToHome}
          >
            Back to Home
          </Button>
          <Button
            variant="outline-secondary"
            style={{ cursor: "pointer" }}
            onClick={handleViewReservations}
          >
            View My Reservations
          </Button>
        </div>
      </Container>
    </>
  );
}
