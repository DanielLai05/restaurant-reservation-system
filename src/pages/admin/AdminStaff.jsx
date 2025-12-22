import React, { useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Modal, Form } from "react-bootstrap";

export default function AdminStaff() {
  const [staff, setStaff] = useState([
    { id: 1, name: "Alice Tan", role: "Staff", status: "Active" },
    { id: 2, name: "Bob Lim", role: "Staff", status: "Inactive" },
    { id: 3, name: "Charlie Ong", role: "Staff", status: "Active" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Staff");

  const toggleStatus = (id) => {
    setStaff(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" }
          : s
      )
    );
  };

  const handleAddStaff = () => {
    if (newStaffName.trim() === "") return;
    const newStaff = {
      id: staff.length + 1,
      name: newStaffName.trim(),
      role: newStaffRole,
      status: "Active"
    };
    setStaff([...staff, newStaff]);
    setNewStaffName("");
    setNewStaffRole("Staff");
    setShowModal(false);
  };

  return (
    <Container className="py-5">
      <h2>Staff Management (Admin)</h2>
      <Button variant="primary" className="my-3" onClick={() => setShowModal(true)}>
        Add New Staff
      </Button>

      <Row>
        {staff.map(s => (
          <Col md={4} key={s.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{s.name}</Card.Title>
                <Card.Text>
                  Role: {s.role} <br />
                  Status:{" "}
                  <Badge bg={s.status === "Active" ? "success" : "secondary"}>
                    {s.status}
                  </Badge>
                </Card.Text>
                <Button
                  variant={s.status === "Active" ? "secondary" : "success"}
                  onClick={() => toggleStatus(s.id)}
                >
                  {s.status === "Active" ? "Deactivate" : "Activate"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for adding new staff */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Staff Name</Form.Label>
            <Form.Control
              type="text"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              placeholder="Enter staff name"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={newStaffRole}
              onChange={(e) => setNewStaffRole(e.target.value)}
            >
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddStaff}>
            Add Staff
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
