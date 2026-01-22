// OrderConfirmation.jsx
import React from "react";
import { Container, Card, Table, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order = [], subtotal = 0, customer = {}, reservation = {}, restaurant = {} } = location.state || {};

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header className="bg-success text-white">
          <h3 className="mb-0">Booking Confirmed!</h3>
        </Card.Header>
        <Card.Body>
          <h5>Thank you, {customer.name || 'Customer'}!</h5>

          {order.length > 0 ? (
            <>
              <p>Your order has been successfully placed.</p>

              <h5 className="mt-4">Order Summary</h5>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>RM {item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h5>Total: RM {subtotal}</h5>
            </>
          ) : (
            <p>Your table reservation has been successfully booked.</p>
          )}

          <h5 className="mt-4">Reservation Info</h5>
          <p>Restaurant: {restaurant?.name || '-'}</p>
          <p>Date: {reservation.date || '-'}</p>
          <p>Time: {reservation.time || '-'}</p>
          <p>Party Size: {reservation.partySize || '-'}</p>

          <h5 className="mt-4">Customer Info</h5>
          <p>Email: {customer.email || '-'}</p>
          <p>Phone: {customer.phone || '-'}</p>

          <Button variant="primary" onClick={() => navigate('/home')} className="mt-3">
            Back to Home
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
