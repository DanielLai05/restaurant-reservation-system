// Unified Navigation Bar Component
import React, { useContext, useState, useEffect, useRef } from "react";
import { Navbar as BSNavbar, Nav, Badge, Dropdown, Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import { AppContext } from "../context/AppContext";
import { auth } from "../firebase";
import { notificationAPI } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { cart } = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const [notificationsData, countData] = await Promise.all([
        notificationAPI.getNotifications(),
        notificationAPI.getNotificationCount()
      ]);
      setNotifications(notificationsData);
      setUnreadCount(countData.count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch on mount and when showing dropdown
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser, showNotifications]);

  // Poll every 5 seconds for new notifications
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markNotificationRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    setShowNotifications(false);
    if (notification.reservation_id) {
      navigate('/my-reservations');
    }
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reservation_confirmed': return '✅';
      case 'reservation_cancelled': return '❌';
      case 'cancellation_approved': return '✅';
      case 'cancellation_rejected': return '↩️';
      case 'reservation_completed': return '🎉';
      case 'reservation_no-show': return '⚠️';
      default: return '🔔';
    }
  };

  // Format time ago
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const cartItemCount = cart?.length || 0;

  return (
    <BSNavbar
      expand="lg"
      className="bg-white shadow-sm"
      style={{ borderBottom: "1px solid #e0e0e0" }}
      expanded={expanded}
    >
      <Container>
        <BSNavbar.Brand
          onClick={() => navigate("/home")}
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.5rem",
            background: "linear-gradient(90deg, #FF7E5F, #FEB47B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          TempahNow
        </BSNavbar.Brand>

        <BSNavbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => { navigate("/home"); setExpanded(false); }}>
              Home
            </Nav.Link>
          </Nav>

          <Nav className="d-flex align-items-center gap-3">
            {/* Notification Bell */}
            {currentUser && (
              <div ref={notificationRef} className="position-relative">
                <div
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    cursor: "pointer",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: unreadCount > 0 ? '#fff7ed' : 'transparent',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = unreadCount > 0 ? '#fff7ed' : 'transparent')}
                >
                  <i
                    className="bi bi-bell-fill"
                    style={{
                      fontSize: "1.5rem",
                      color: unreadCount > 0 ? "#FF7E5F" : "#6c757d"
                    }}
                  ></i>
                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                      }}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </div>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <Card
                    className="position-absolute end-0 mt-2 shadow"
                    style={{
                      width: '360px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      zIndex: 1050,
                      minWidth: '320px',
                      right: '-60px',
                      borderRadius: '12px',
                    }}
                  >
                    <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3 px-3">
                      <span className="fw-bold">Notifications</span>
                      {unreadCount > 0 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-primary p-0"
                          onClick={handleMarkAllAsRead}
                        >
                          Mark all read
                        </Button>
                      )}
                    </Card.Header>
                    <Card.Body className="p-0" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div className="text-center text-muted py-4">
                          <i className="bi bi-bell-slash" style={{ fontSize: '2rem' }}></i>
                          <p className="mb-0 mt-2">No notifications</p>
                        </div>
                      ) : (
                        <div>
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`d-flex gap-2 py-3 px-3 border-bottom ${!notification.is_read ? 'bg-light' : ''}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div
                                style={{
                                  width: '42px',
                                  height: '42px',
                                  borderRadius: '50%',
                                  background: notification.type.includes('cancelled') || notification.type.includes('rejected') ? '#fee2e2' : '#dcfce7',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1.2rem',
                                }}
                              >
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start">
                                  <span className="fw-semibold small">{notification.title}</span>
                                  <span className="text-muted small" style={{ fontSize: '0.7rem' }}>
                                    {formatTimeAgo(notification.created_at)}
                                  </span>
                                </div>
                                <p className="mb-0 small text-muted" style={{ fontSize: '0.8rem' }}>
                                  {notification.message.length > 60
                                    ? notification.message.substring(0, 60) + '...'
                                    : notification.message}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}
              </div>
            )}

            {/* Cart Icon */}
            <div
              onClick={() => {
                navigate("/cart");
                setExpanded(false);
              }}
              style={{
                cursor: "pointer",
                position: "relative",
                padding: "8px 12px",
                borderRadius: "8px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <i className="bi bi-cart-fill" style={{ fontSize: "1.5rem", color: "#FF7E5F" }}></i>
              {cartItemCount > 0 && (
                <Badge
                  bg="danger"
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                  }}
                >
                  {cartItemCount}
                </Badge>
              )}
            </div>

            {/* User Menu */}
            {currentUser && (
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="user-dropdown"
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i className="bi bi-person-circle" style={{ fontSize: "1.5rem" }}></i>
                  <span className="d-none d-md-inline">
                    {currentUser.email?.split("@")[0] || "User"}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Dropdown.ItemText>
                    <small className="text-muted">{currentUser.email}</small>
                  </Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => { navigate("/my-reservations"); setExpanded(false); }}>
                    <i className="bi bi-calendar-event me-2"></i>
                    My Reservations
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
