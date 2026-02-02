import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  Table,
  Modal,
  Badge,
  Alert,
  InputGroup
} from 'react-bootstrap'
import { staffAPI } from '../../services/api'

const StaffTables = () => {
  const navigate = useNavigate()
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTable, setEditingTable] = useState(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [tableNumber, setTableNumber] = useState('')
  const [capacity, setCapacity] = useState(4)
  const [location, setLocation] = useState('')

  const fetchTables = async () => {
    try {
      setLoading(true)
      const data = await staffAPI.getTables()
      setTables(data)
    } catch (err) {
      console.error('Error fetching tables:', err)
      setError(err.message || 'Failed to load tables')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const handleSaveTable = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const tableData = {
        table_number: tableNumber,
        capacity: parseInt(capacity),
        location: location || null
      }

      if (editingTable) {
        await staffAPI.updateTable(editingTable.id, tableData)
      } else {
        await staffAPI.addTable(tableData)
      }

      fetchTables()
      closeModal()
    } catch (err) {
      console.error('Error saving table:', err)
      setError(err.message || 'Failed to save table')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTable = async (table) => {
    if (!window.confirm(`Are you sure you want to delete Table ${table.table_number}?`)) {
      return
    }

    try {
      await staffAPI.deleteTable(table.id)
      fetchTables()
    } catch (err) {
      console.error('Error deleting table:', err)
      alert(err.message || 'Failed to delete table')
    }
  }

  const handleEditTable = (table) => {
    setEditingTable(table)
    setTableNumber(table.table_number)
    setCapacity(table.capacity)
    setLocation(table.location || '')
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingTable(null)
    setTableNumber('')
    setCapacity(4)
    setLocation('')
    setError('')
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Table Management</h2>
          <p className="text-muted mb-0">Manage your restaurant tables</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
            border: 'none'
          }}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add New Table
        </Button>
      </div>

      {/* Summary Stats */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-0">{tables.length}</h3>
              <p className="text-muted mb-0">Total Tables</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-0">{tables.reduce((sum, t) => sum + t.capacity, 0)}</h3>
              <p className="text-muted mb-0">Total Seats</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tables Table */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading tables...</p>
            </div>
          ) : tables.length === 0 ? (
            <div className="text-center py-5">
              <h5>No Tables Yet</h5>
              <p className="text-muted mb-3">Add your first table to start accepting reservations</p>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                  border: 'none'
                }}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Add First Table
              </Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Table Number</th>
                  <th>Capacity</th>
                  <th>Location</th>
                  <th>Availability</th>
                  <th className="text-end" style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables.map(table => (
                  <tr key={table.id}>
                    <td>
                      <strong>Table {table.table_number}</strong>
                    </td>
                    <td>
                      {table.capacity} seats
                    </td>
                    <td>
                      {table.location ? (
                        <span>{table.location}</span>
                      ) : (
                        <span className="text-muted">Not specified</span>
                      )}
                    </td>
                    <td>
                      <Badge bg={table.is_available ? 'success' : 'secondary'}>
                        {table.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditTable(table)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTable(table)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Table Modal */}
      <Modal show={showAddModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingTable ? 'Edit Table' : 'Add New Table'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSaveTable}>
            <Form.Group className="mb-3">
              <Form.Label>Table Number *</Form.Label>
              <Form.Control
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g., 1, A1, VIP1"
                required
              />
              <Form.Text className="text-muted">
                A unique identifier for this table
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity (seats) *</Form.Label>
              <Form.Select
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'seat' : 'seats'}</option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Maximum 8 seats per table
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Window, Patio, Indoor, Private Room"
                maxLength={100}
              />
              <Form.Text className="text-muted">
                Where is this table located (max 100 characters)
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={saving}
                style={{
                  background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                  border: 'none'
                }}
              >
                {saving ? 'Saving...' : (editingTable ? 'Update Table' : 'Add Table')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default StaffTables
