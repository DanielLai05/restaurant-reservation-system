// TableSelector.jsx
import React from "react";
import { Card, Row, Col } from "react-bootstrap";

export default function TableSelector({ tables, selectedTable, setSelectedTable }) {
  return (
    <Row xs={2} sm={3} md={4} className="g-3">
      {tables.map((table) => (
        <Col key={table.id}>
          <Card
            className={`text-center ${selectedTable?.id === table.id ? 'border-success' : ''}`}
            style={{
              cursor: table.occupied ? "not-allowed" : "pointer",
              background: table.occupied ? "#f8d7da" : "#e2e3e5",
              height: "80px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: selectedTable?.id === table.id ? "3px" : "1px",
            }}
            onClick={() => !table.occupied && setSelectedTable(table)}
          >
            <div>
              <h6>Table {table.number}</h6>
              <small>{table.capacity} people</small>
              {table.occupied && <div className="text-danger">Occupied</div>}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
