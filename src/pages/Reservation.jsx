import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Reservation() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(1);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const reservationData = {
      date,
      time,
      partySize,
    };

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
      <h2>Reservation</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </Form.Group>

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

        <Button type="submit" variant="success">
          Confirm Reservation
        </Button>
      </Form>
    </Container>
  );
}
