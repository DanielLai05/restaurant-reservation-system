// AdminDashboard.jsx
import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [restaurants] = useState([
    { id: 1, name: "Restaurant A" },
    { id: 2, name: "Restaurant B" },
    { id: 3, name: "Restaurant C" },
  ]);

  const [orders] = useState([
    { id: 1, details: "Order 1" },
    { id: 2, details: "Order 2" },
    { id: 3, details: "Order 3" },
    { id: 4, details: "Order 4" },
  ]);

  return (
    <Container className="py-5">
      <h2>Admin Dashboard</h2>
      <Row className="my-4">
        <Col md={6} className="mb-3">
          <Card className="text-center shadow">
            <Card.Body>
              <Card.Title>Total Restaurants</Card.Title>
              <h3>{restaurants.length}</h3>
              <Button
                variant="primary"
                onClick={() => navigate("/admin/restaurants")}
              >
                Manage Restaurants
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="text-center shadow">
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <h3>{orders.length}</h3>
              <Button
                variant="primary"
                onClick={() => navigate("/admin/orders")}
              >
                View Orders
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="my-4">
        <Col md={6}>
          <Card className="text-center shadow">
            <Card.Body>
              <Card.Title>Staff Management</Card.Title>
              <Button
                variant="primary"
                onClick={() => navigate("/admin/staff")}
              >
                Manage Staff
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
