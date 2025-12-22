import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";

export default function AdminOrders() {
  const [orders, setOrders] = useState([
    { id: 1, customer: "John Doe", restaurant: "Sushi Place", total: 45.0, status: "Pending" },
    { id: 2, customer: "Alice Smith", restaurant: "Pizza Corner", total: 30.0, status: "Completed" },
    { id: 3, customer: "Bob Lee", restaurant: "Sushi Place", total: 60.0, status: "In Progress" },
  ]);

  return (
    <Container className="py-5">
      <h2>All Orders (Admin)</h2>
      <Row className="mt-3">
        {orders.map(order => (
          <Col md={4} key={order.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{order.customer}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{order.restaurant}</Card.Subtitle>
                <Card.Text>Total: ${order.total.toFixed(2)}</Card.Text>
                <Card.Text>
                  Status:{" "}
                  <Badge bg={
                    order.status === "Completed"
                      ? "success"
                      : order.status === "Pending"
                      ? "warning"
                      : "info"
                  }>
                    {order.status}
                  </Badge>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
