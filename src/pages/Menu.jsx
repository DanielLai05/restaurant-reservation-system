import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";

export default function Menu() {
  const menuData = [
    {
      id: 1,
      name: "Grilled Chicken",
      description: "Tender grilled chicken with herbs",
      price: "RM 18.90",
      category: "Main",
      image: "https://via.placeholder.com/200"
    },
    {
      id: 2,
      name: "Caesar Salad",
      description: "Fresh lettuce with parmesan and croutons",
      price: "RM 12.50",
      category: "Appetizer",
      image: "https://via.placeholder.com/200"
    },
    {
      id: 3,
      name: "Iced Lemon Tea",
      description: "Refreshing lemon tea served cold",
      price: "RM 6.00",
      category: "Drinks",
      image: "https://via.placeholder.com/200"
    }
  ];

  const categories = ["All", "Appetizer", "Main", "Drinks"];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredMenu =
    activeCategory === "All"
      ? menuData
      : menuData.filter((item) => item.category === activeCategory);

  return (
    <Container className="py-4">
      <h2 className="mb-4">Menu</h2>

      <Nav variant="tabs" className="mb-4">
        {categories.map((cat) => (
          <Nav.Item key={cat}>
            <Nav.Link
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Row>
        {filteredMenu.map((item) => (
          <Col md={4} sm={6} xs={12} className="mb-4" key={item.id}>
            <Card className="h-100">
              <Card.Img variant="top" src={item.image} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <h5>{item.price}</h5>
                <Button variant="primary" className="mt-2" style={{ width: "100%" }}>
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
