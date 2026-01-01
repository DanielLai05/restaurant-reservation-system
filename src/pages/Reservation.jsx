// Reservation.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Reservation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant, cart = [], table } = location.state || {};
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(table?.seats || 1);

  if (!restaurant || !table) {
    return (
      <div className="my-5 text-center">
        <p>Please select a restaurant and table first.</p>
        <button className="btn btn-primary" onClick={() => navigate("/home")}>
          Back to Home
        </button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Reservation confirmed for ${partySize} people at ${restaurant.name} on ${date} ${time}`
    );
    navigate("/home");
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container my-5">
      <h3>Reservation at {restaurant.name}</h3>
      <p>Table: {table.name}</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Date</label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Party Size</label>
          <input
            type="number"
            min={1}
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-success">
          Confirm Reservation
        </button>
      </form>
    </div>
  );
}
