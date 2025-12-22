// RestaurantDetails.jsx
import React, { useContext } from "react";
import { Container, Card, Button, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

import sushiRollImg from "../assets/menu/sushi-roll.png";
import ramenImg from "../assets/menu/ramen.png";

const menuItems = [
  { id: 1, name: "Sushi Roll", price: 25, image: sushiRollImg },
  { id: 2, name: "Ramen", price: 18, image: ramenImg },
];

export default function RestaurantDetails() {
  const navigate = useNavigate();
  const { selectedRestaurant, addToCart, cart } = useContext(AppContext);

  if (!selectedRestaurant) {
    return (
      <Container className="my-5 text-center">
        <p>Please select a restaurant from Home page.</p>
        <Button
          style={{ background: "linear-gradient(90deg,#FF7E5F,#FEB47B)", border: "none" }}
          onClick={() => navigate("/home")}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Restaurant Header */}
      <Card className="mb-4 shadow-sm border-0 rounded-4">
        <div
          style={{
            background: `url('${selectedRestaurant.image}') center / cover no-repeat`,
            height: "300px",
            borderRadius: "16px",
          }}
        />
        <Card.Body className="text-center">
          <h2 className="fw-bold">{selectedRestaurant.name}</h2>
          <p className="text-muted">
            {selectedRestaurant.cuisine} • {selectedRestaurant.location}
          </p>
          {selectedRestaurant.popular && <Badge bg="danger">Popular</Badge>}{" "}
          {selectedRestaurant.discount && <Badge bg="success">{selectedRestaurant.discount}</Badge>}
        </Card.Body>
      </Card>

      {/* Menu */}
      <h3 className="mb-3">Menu</h3>
      <Row xs={1} sm={2} md={3} className="g-4">
        {menuItems.map((item) => {
          const cartItem = cart.find((c) => c.id === item.id);
          const quantityInCart = cartItem ? cartItem.quantity : 0;

          return (
            <Col key={item.id}>
              <Card
                className="h-100 border-0 shadow-sm"
                style={{
                  borderRadius: "16px",
                  cursor: "pointer",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.08)";
                }}
              >
                <div
                  style={{
                    background: `url('${item.image}') center/cover no-repeat`,
                    height: "180px",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                  }}
                />
                <Card.Body>
                  <h5 className="fw-bold">{item.name}</h5>
                  <p className="mb-2">${item.price}</p>
                  <p>In Cart: {quantityInCart}</p>
                  <Button
                    style={{
                      background: "linear-gradient(90deg,#FF7E5F,#FEB47B)",
                      border: "none",
                    }}
                    onClick={() => addToCart(item, 1)}
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Go to Cart */}
      <div className="text-center mt-4">
        <Button
          style={{
            background: "linear-gradient(90deg,#FF7E5F,#FEB47B)",
            border: "none",
            padding: "0.6rem 2rem",
          }}
          onClick={() => navigate("/cart")}
        >
          Go to Cart ({cart.reduce((sum, c) => sum + c.quantity, 0)})
        </Button>
      </div>
    </Container>
  );
}
