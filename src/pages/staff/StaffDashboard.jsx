// StaffDashboard.jsx
import React from "react";
import { Container, Row, Col, Card, Button, ListGroup, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const navigate = useNavigate();

  const todayOrders = [
    { id: 1, customer: "John Doe", total: 45.0, status: "Pending" },
    { id: 2, customer: "Jane Smith", total: 32.5, status: "Completed" },
  ];

  const todayReservations = [
    { id: 1, customer: "Alice", date: "2025-12-22", time: "18:00", partySize: 4, status: "Confirmed" },
    { id: 2, customer: "Bob", date: "2025-12-22", time: "19:00", partySize: 2, status: "Pending" },
  ];

  const statusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning">{status}</Badge>;
      case "Confirmed":
        return <Badge bg="success">{status}</Badge>;
      case "Completed":
        return <Badge bg="secondary">{status}</Badge>;
      default:
        return <Badge bg="light">{status}</Badge>;
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Staff Dashboard</h2>

      <Row className="g-4">
        {/* Orders Summary Card */}
        <Col md={4}>
          <Card className="shadow-sm p-3">
            <Card.Title>Today's Orders</Card.Title>
            <Card.Text className="display-6">{todayOrders.length}</Card.Text>
            <Button variant="primary" className="w-100 mb-2" onClick={() => navigate("/staff/orders")}>
              Manage Orders
            </Button>
            <ListGroup variant="flush">
              {todayOrders.map((o) => (
                <ListGroup.Item key={o.id} className="d-flex justify-content-between align-items-center">
                  {o.customer}
                  {statusBadge(o.status)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Reservations Summary Card */}
        <Col md={4}>
          <Card className="shadow-sm p-3">
            <Card.Title>Today's Reservations</Card.Title>
            <Card.Text className="display-6">{todayReservations.length}</Card.Text>
            <Button variant="primary" className="w-100 mb-2" onClick={() => navigate("/staff/reservations")}>
              Manage Reservations
            </Button>
            <ListGroup variant="flush">
              {todayReservations.map((r) => (
                <ListGroup.Item key={r.id} className="d-flex justify-content-between align-items-center">
                  {r.customer} ({r.partySize})
                  {statusBadge(r.status)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Quick Actions Card */}
        <Col md={4}>
          <Card className="shadow-sm p-3">
            <Card.Title>Quick Actions</Card.Title>
            <Button variant="success" className="w-100 mb-2" onClick={() => navigate("/staff/orders")}>
              New Order
            </Button>
            <Button variant="info" className="w-100 mb-2" onClick={() => navigate("/staff/reservations")}>
              New Reservation
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
