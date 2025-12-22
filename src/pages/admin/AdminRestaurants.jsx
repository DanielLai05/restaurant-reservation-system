import React, { useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Modal, Form } from "react-bootstrap";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([
    { id: 1, name: "Sushi Place", status: "Enabled" },
    { id: 2, name: "Pizza Corner", status: "Disabled" },
    { id: 3, name: "Burger House", status: "Enabled" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");

  const toggleStatus = (id) => {
    setRestaurants(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: r.status === "Enabled" ? "Disabled" : "Enabled" }
          : r
      )
    );
  };

  const handleAddRestaurant = () => {
    if (newName.trim() === "") return;
    const newRestaurant = {
      id: restaurants.length + 1,
      name: newName.trim(),
      status: "Enabled"
    };
    setRestaurants([...restaurants, newRestaurant]);
    setNewName("");
    setShowModal(false);
  };

  return (
    <Container className="py-5">
      <h2>Restaurants Management (Admin)</h2>
      <Button variant="primary" className="my-3" onClick={() => setShowModal(true)}>
        Add New Restaurant
      </Button>

      <Row>
        {restaurants.map(r => (
          <Col md={4} key={r.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{r.name}</Card.Title>
                <Card.Text>
                  Status:{" "}
                  <Badge bg={r.status === "Enabled" ? "success" : "secondary"}>
                    {r.status}
                  </Badge>
                </Card.Text>
                <Button
                  variant={r.status === "Enabled" ? "secondary" : "success"}
                  onClick={() => toggleStatus(r.id)}
                >
                  {r.status === "Enabled" ? "Disable" : "Enable"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for adding new restaurant */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter restaurant name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddRestaurant}>
            Add Restaurant
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
