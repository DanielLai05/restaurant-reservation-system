// VisualTableReservation.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VisualTableReservation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant, cart = [] } = location.state || {};

  if (!restaurant) {
    return <p className="my-5 text-center">Please select a restaurant first.</p>;
  }

  const [selectedTable, setSelectedTable] = useState(null);

  const tables = [
    { id: 1, name: "Table 1", seats: 4 },
    { id: 2, name: "Table 2", seats: 4 },
    { id: 3, name: "Table 3", seats: 2 },
  ];

  const handleConfirm = () => {
    navigate("/reservation", { state: { restaurant, cart, table: selectedTable } });
  };

  return (
    <div className="container my-5">
      <h3 className="text-center">Visual Table Reservation for {restaurant.name}</h3>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "2rem", justifyContent: "center" }}>
        {tables.map((table) => (
          <div
            key={table.id}
            onClick={() => setSelectedTable(table)}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "16px",
              background: selectedTable?.id === table.id ? "#FF7E5F" : "#eee",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {table.name}
            {/* 椅子小圆点 */}
            {Array.from({ length: table.seats }).map((_, idx) => {
              const angle = (360 / table.seats) * idx;
              const radius = 50;
              const rad = (angle * Math.PI) / 180;
              return (
                <div
                  key={idx}
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#333",
                    position: "absolute",
                    top: 50 - 10 + radius * Math.sin(rad),
                    left: 50 - 10 + radius * Math.cos(rad),
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-success"
          disabled={!selectedTable}
          onClick={handleConfirm}
        >
          Confirm Table
        </button>
      </div>
    </div>
  );
}
