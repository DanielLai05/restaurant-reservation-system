// StaffMenu.jsx - Staff Menu Management Page
import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Card, Row, Col, Button, Form, Table, Badge, Spinner, Alert, Modal, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../../context/RoleContext";
import { staffAPI } from "../../services/api";
import { uploadImage } from "../../services/fileUpload";
import { useToast, ToastProvider } from "../../components/Toast";

export default function StaffMenu() {
  const navigate = useNavigate();
  const { userRestaurantId, clearRole, userRole } = useContext(RoleContext);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Form state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Category form
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  // Item form
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [itemImagePreview, setItemImagePreview] = useState(null);
  const [itemAvailable, setItemAvailable] = useState(true);

  const { showToast, removeToast, toasts } = useToast();
  const fileInputRef = useRef(null);

  // Redirect if not staff
  useEffect(() => {
    if (userRole && userRole !== 'staff') {
      navigate("/admin/dashboard");
    }
  }, [userRole, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    clearRole();
    navigate("/staff/login");
  };

  // Fetch categories and items
  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesData, itemsData] = await Promise.all([
        staffAPI.getMenuCategories().catch(err => {
          console.error('Error fetching categories:', err);
          return [];
        }),
        staffAPI.getMenuItems().catch(err => {
          console.error('Error fetching items:', err);
          return [];
        })
      ]);

      setCategories(categoriesData);
      setMenuItems(itemsData);
    } catch (err) {
      console.error('Error fetching menu data:', err);
      setError(err.message || "Failed to load menu data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRestaurantId) {
      fetchMenuData();
    }
  }, [userRestaurantId]);

  // Filter items by selected category
  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category_id === parseInt(selectedCategory))
    : menuItems;

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.");
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size too large. Maximum size is 5MB.");
        return;
      }
      setItemImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setItemImage(null);
    setItemImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      setSaving(true);
      await staffAPI.addMenuCategory({
        name: categoryName,
        description: categoryDescription
      });
      setShowAddCategoryModal(false);
      setCategoryName("");
      setCategoryDescription("");
      fetchMenuData();
      showToast("Category added successfully", "success");
    } catch (err) {
      console.error('Error adding category:', err);
      alert(err.message || "Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  // Add/Update item
  const handleSaveItem = async () => {
    if (!itemCategoryId) {
      alert("Please select a category");
      return;
    }
    if (!itemName.trim()) {
      alert("Please enter item name");
      return;
    }
    if (!itemPrice || parseFloat(itemPrice) < 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      setSaving(true);

      // Upload image if selected
      let imageUrl = editingItem?.image_url || null;
      if (itemImage) {
        imageUrl = await uploadImage(itemImage, "menu-items");
      }

      const itemData = {
        category_id: parseInt(itemCategoryId),
        name: itemName,
        description: itemDescription,
        price: parseFloat(itemPrice),
        image_url: imageUrl,
        is_available: itemAvailable,
      };

      if (editingItem) {
        await staffAPI.updateMenuItem(editingItem.id, itemData);
        showToast("Item updated successfully", "success");
      } else {
        await staffAPI.addMenuItem(itemData);
        showToast("Item added successfully", "success");
      }

      closeItemModal();
      fetchMenuData();
    } catch (err) {
      console.error('Error saving item:', err);
      alert(err.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  // Delete item
  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.item_name}"?`)) {
      return;
    }

    try {
      await staffAPI.deleteMenuItem(item.id);
      fetchMenuData();
      showToast("Item deleted successfully", "success");
    } catch (err) {
      console.error('Error deleting item:', err);
      alert(err.message || "Failed to delete item");
    }
  };

  // Open item modal for editing
  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemCategoryId(item.category_id.toString());
    setItemName(item.item_name);
    setItemDescription(item.description || "");
    setItemPrice(item.price.toString());
    setItemImage(null);
    setItemImagePreview(item.image_url || null);
    setItemAvailable(item.is_available !== false);
    setShowAddItemModal(true);
  };

  // Close item modal and reset form
  const closeItemModal = () => {
    setShowAddItemModal(false);
    setEditingItem(null);
    setItemCategoryId("");
    setItemName("");
    setItemDescription("");
    setItemPrice("");
    setItemImage(null);
    setItemImagePreview(null);
    setItemAvailable(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount || 0);
  };

  if (loading && categories.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading menu...</p>
      </Container>
    );
  }

  return (
    <>
      <ToastProvider toasts={toasts} removeToast={removeToast} />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <Button variant="link" onClick={() => navigate("/staff/dashboard")} className="ps-0 mb-2">
              ← Back to Dashboard
            </Button>
            <h2>Menu Management</h2>
            <p className="text-muted mb-0">Manage your restaurant's menu categories and items</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm" onClick={fetchMenuData}>
              🔄 Refresh
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Category Filter */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={6}>
                <Form.Label className="mb-0">Filter by Category:</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-2"
                  style={{ maxWidth: '300px' }}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} className="text-md-end mt-3 mt-md-0">
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => setShowAddCategoryModal(true)}
                >
                  <i className="bi bi-folder-plus me-2"></i>
                  Add Category
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowAddItemModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                    border: 'none'
                  }}
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Add Item
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Categories Summary */}
        <Row className="g-3 mb-4">
          <Col md={4}>
            <Card className="text-center h-100">
              <Card.Body>
                <Card.Title className="display-6">{categories.length}</Card.Title>
                <Card.Text>Categories</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center h-100">
              <Card.Body>
                <Card.Title className="display-6">{menuItems.length}</Card.Title>
                <Card.Text>Total Items</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center h-100 bg-success-subtle">
              <Card.Body>
                <Card.Title className="display-6">
                  {menuItems.filter(i => i.is_available !== false).length}
                </Card.Title>
                <Card.Text>Available Items</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Menu Items Table */}
        <Card>
          <Card.Header>
            <strong>Menu Items</strong>
            {selectedCategory && (
              <Badge bg="primary" className="ms-2">
                {categories.find(c => c.id === parseInt(selectedCategory))?.name}
              </Badge>
            )}
          </Card.Header>
          <Card.Body>
            {filteredItems.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽️</div>
                <h5>No Menu Items Found</h5>
                <p className="text-muted">
                  {selectedCategory
                    ? "This category has no items yet. Add your first item!"
                    : "Start by adding categories and menu items."}
                </p>
              </div>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.item_name}
                            thumbnail
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="bg-light d-flex align-items-center justify-content-center"
                            style={{ width: '60px', height: '60px', borderRadius: '4px' }}
                          >
                            <i className="bi bi-image text-muted"></i>
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{item.item_name}</strong>
                      </td>
                      <td>
                        <Badge bg="secondary">{item.category_name}</Badge>
                      </td>
                      <td>
                        <span className="text-muted small">
                          {item.description?.length > 50
                            ? item.description.substring(0, 50) + '...'
                            : item.description || '-'}
                        </span>
                      </td>
                      <td>
                        <strong className="text-success">{formatCurrency(item.price)}</strong>
                      </td>
                      <td>
                        <Badge bg={item.is_available !== false ? 'success' : 'danger'}>
                          {item.is_available !== false ? 'Available' : 'Unavailable'}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEditItem(item)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteItem(item)}
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
      </Container>

      {/* Add Category Modal */}
      <Modal show={showAddCategoryModal} onHide={() => setShowAddCategoryModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Category Name *</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Appetizers, Main Course, Drinks"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Optional description for this category"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAddCategoryModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddCategory}
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
              border: 'none'
            }}
          >
            {saving ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" />
                <span className="ms-2">Saving...</span>
              </>
            ) : (
              'Add Category'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Item Modal */}
      <Modal show={showAddItemModal} onHide={closeItemModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  value={itemCategoryId}
                  onChange={(e) => setItemCategoryId(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                  ))}
                </Form.Select>
                {categories.length === 0 && (
                  <Form.Text className="text-warning">
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    Please add a category first
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Item Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g., Chicken Rice, Caesar Salad"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Describe this dish..."
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price (RM) *</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <div
                  className="d-flex align-items-start gap-3 p-3 rounded-3"
                  style={{ backgroundColor: '#f8f9fa', border: '2px dashed #dee2e6' }}
                >
                  <div className="flex-shrink-0">
                    {itemImagePreview ? (
                      <div
                        className="position-relative overflow-hidden"
                        style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <img
                          src={itemImagePreview}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center"
                          onClick={handleRemoveImage}
                          style={{
                            width: '24px',
                            height: '24px',
                            padding: 0,
                            borderRadius: '50%',
                            fontSize: '12px'
                          }}
                        >
                          <i className="bi bi-x"></i>
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: '120px',
                          height: '120px',
                          border: '2px dashed #ced4da',
                          borderRadius: '8px',
                          backgroundColor: '#fff'
                        }}
                      >
                        <i className="bi bi-image" style={{ fontSize: '2rem', color: '#adb5bd' }}></i>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1 d-flex flex-column justify-content-center">
                    <Form.Control
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                    <Form.Text className="text-muted small">
                      JPEG, PNG, GIF, WebP. Max 5MB.
                    </Form.Text>
                  </div>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={itemAvailable ? "available" : "unavailable"}
                  onChange={(e) => setItemAvailable(e.target.value === "available")}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeItemModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveItem}
            disabled={saving || categories.length === 0}
            style={{
              background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
              border: 'none'
            }}
          >
            {saving ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" />
                <span className="ms-2">Saving...</span>
              </>
            ) : (
              editingItem ? 'Update Item' : 'Add Item'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
