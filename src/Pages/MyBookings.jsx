import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Authentication/AuthContext';
import { API_BASE_URL } from '../BaseURL/api';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';

const MyBookings = () => {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (loading) return; // Wait for loading to finish

      if (!user || !user.name) {
        setError('User profile is not available.');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/holidaze/profiles/${user.name}/bookings`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });

        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings.');
      }
    };

    fetchBookings();
  }, [user, loading]);

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`${API_BASE_URL}/holidaze/bookings/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setBookings(bookings.map(booking => booking.id === id ? { ...booking, ...updatedData } : booking));
      setEditBooking(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/holidaze/bookings/${id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setBookings(bookings.filter(booking => booking.id !== id));
      setDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking.');
    }
  };

  const renderBookingForm = (booking) => (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Edit Booking</Card.Title>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            const { dateFrom, dateTo, guests } = e.target.elements;
            const updatedData = {
              dateFrom: dateFrom.value,
              dateTo: dateTo.value,
              guests: parseInt(guests.value, 10) || 0,
            };

            if (updatedData.guests <= 0) {
              setError('Number of guests must be a positive integer.');
              return;
            }

            handleUpdate(booking.id, updatedData);
          }}
        >
          <Form.Group controlId="formDateFrom">
            <Form.Label>Date From</Form.Label>
            <Form.Control type="date" name="dateFrom" defaultValue={new Date(booking.dateFrom).toISOString().split('T')[0]} required />
          </Form.Group>
          <Form.Group controlId="formDateTo">
            <Form.Label>Date To</Form.Label>
            <Form.Control type="date" name="dateTo" defaultValue={new Date(booking.dateTo).toISOString().split('T')[0]} required />
          </Form.Group>
          <Form.Group controlId="formGuests">
            <Form.Label>Guests</Form.Label>
            <Form.Control type="number" name="guests" defaultValue={booking.guests} min="1" required />
          </Form.Group>
          <Button variant="success" type="submit" className="mt-3">
            Update
          </Button>
          <Button variant="secondary" onClick={() => setEditBooking(null)} className="mt-3 ms-2">
            Cancel
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );

  const renderBookings = () => (
    <Row>
      {bookings.map(booking => (
        <Col md={6} lg={4} key={booking.id} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Booking ID: {booking.id}</Card.Title>
              <Card.Text>
                <strong>Date From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}<br />
                <strong>Date To:</strong> {new Date(booking.dateTo).toLocaleDateString()}<br />
                <strong>Guests:</strong> {booking.guests}<br />
                <strong>Created:</strong> {new Date(booking.created).toLocaleDateString()}<br />
                <strong>Updated:</strong> {new Date(booking.updated).toLocaleDateString()}
              </Card.Text>
              <Button variant="success" onClick={() => setEditBooking(booking)} className="me-2">
                Update
              </Button>
              <Button variant="danger" onClick={() => setDeleteId(booking.id)}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <h1 className="my-4">My Bookings</h1>
      {editBooking && renderBookingForm(editBooking)}
      {deleteId && (
        <Alert variant="warning" className="d-flex justify-content-between align-items-center">
          <span>Are you sure you want to delete this booking?</span>
          <div>
            <Button variant="danger" onClick={() => handleDelete(deleteId)} className="me-2">
              Yes, delete
            </Button>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
          </div>
        </Alert>
      )}
      {bookings.length === 0 ? (
        <Alert variant="info">No bookings found.</Alert>
      ) : (
        renderBookings()
      )}
    </Container>
  );
};

export default MyBookings;
