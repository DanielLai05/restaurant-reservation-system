// ShoppingCart.jsx
import React, { useContext } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { cart = [], clearCart } = useContext(AppContext);

  if (!cart || cart.length === 0) {
    return (
      <Container className="my-5 text-center">
        <p className="fs-5">Your cart is empty.</p>
        <Button
          style={{ background: "linear-gradient(90deg,#FF7E5F,#FEB47B)", border: "none" }}
          onClick={() => navigate("/home")}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Shopping Cart</h2>
      <Row xs={1} sm={2} md={3} className="g-4">
        {cart.map((item, idx) => (
          <Col key={idx}>
            <Card className="h-100 shadow-sm border-0" style={{ borderRadius: "16px" }}>
              <div
                style={{
                  background: `url('${item.image}') center/cover no-repeat`,
                  height: "180px",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
              />
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold">{item.name}</h5>
                  <p className="mb-1">Quantity: <Badge bg="info">{item.quantity}</Badge></p>
                  <p className="mb-0 fw-semibold">Price: ${item.price * item.quantity}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-4 text-end">
        <h4 className="mb-3">Subtotal: ${subtotal.toFixed(2)}</h4>
        <Button
          style={{ background: "linear-gradient(90deg,#FF7E5F,#FEB47B)", border: "none" }}
          className="me-2"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          style={{ background: "linear-gradient(90deg,#FF7E5F,#FEB47B)", border: "none" }}
          onClick={() => navigate("/reservation")}
        >
          Proceed to Reservation
        </Button>
        <Button
          variant="danger"
          className="ms-2"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>
    </Container>
  );
}
