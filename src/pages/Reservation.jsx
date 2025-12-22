// Reservation.jsx
import React, { useState } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Reservation() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const reservationData = { date, time, partySize };
    console.log("Submitting reservation:", reservationData);

    setTimeout(() => {
      alert(`Reservation confirmed for ${reservationData.partySize} people on ${reservationData.date} at ${reservationData.time}`);
      navigate("/payment", { state: reservationData });
      setDate("");
      setTime("");
      setPartySize(1);
    }, 500);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Container className="my-5">
      <Card className="shadow-sm p-4" style={{ borderRadius: "16px", maxWidth: "600px", margin: "0 auto" }}>
        <h2 className="mb-4 text-center">Reservation</h2>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Time</Form.Label>
                <Form.Control
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Party Size</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, #FF7E5F, #FEB47B)",
              border: "none",
              fontWeight: "600",
              padding: "10px 0",
              fontSize: "1.1rem",
            }}
          >
            Confirm Reservation
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
