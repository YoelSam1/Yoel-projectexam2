  import React, { useState, useEffect } from 'react';
  import { useParams } from 'react-router-dom';
  import axios from 'axios';
  import { API_BASE_URL } from '../BaseURL/api';
  import { useAuth } from '../Authentication/AuthContext';
  import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
  import defaultImage from '../Assets/images/Sun.png'; 

  const VenueDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [venue, setVenue] = useState(null);
    const [form, setForm] = useState({ dateFrom: '', dateTo: '', guests: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
      const fetchVenueDetails = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/holidaze/venues/${id}?_bookings=true`);
          setVenue(response.data);
        } catch (error) {
          console.error('Error fetching venue details:', error);
        }
      };

      fetchVenueDetails();
    }, [id]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const { dateFrom, dateTo, guests } = form;

      if (!dateFrom || !dateTo || !guests || isNaN(guests) || Number(guests) <= 0) {
        setMessage({ type: 'danger', text: 'Please fill out all fields correctly.' });
        return;
      }

      try {
        if (!user || !user.accessToken) {
          setMessage({ type: 'danger', text: 'No authentication token found. Please log in.' });
          return;
        }

        await axios.post(`${API_BASE_URL}/holidaze/bookings`, {
          dateFrom,
          dateTo,
          guests: Number(guests),
          venueId: id
        }, {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
          }
        });

        setMessage({ type: 'success', text: 'Booking created successfully!' });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setMessage({ type: 'danger', text: 'Unauthorized. Please check your credentials.' });
        } else {
          setMessage({ type: 'danger', text: 'Error: Exceeds max guests allowed.' });
        }
        console.error('Error creating booking:', error);
      }
    };

    if (!venue) {
      return <p>Loading venue details...</p>;
    }

    // date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    return (
      <Container className="mt-5">
        <Row>
          <Col md={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Img
                variant="top"
                src={venue.media.length ? venue.media[0] : defaultImage}
                alt={venue.name}
                className='venuecard2'
                onError={(e) => (e.target.src = defaultImage)} 
              />
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h2 className="text-primary">{venue.name}</h2>
                <Card.Text className="text-muted">{venue.description}</Card.Text>
                <hr />
                <Card.Text>
                  <strong>Location:</strong> {venue.location.address}, {venue.location.city}, {venue.location.country}
                </Card.Text>
                <Card.Text>
                  <strong>Price:</strong> ${venue.price} per night
                </Card.Text>
                <Card.Text>
                  <strong>Max Guests:</strong> {venue.maxGuests}
                </Card.Text>
                <Card.Text>
                  <strong>Rating:</strong> {venue.rating} / 5
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {user && (
          <Row className="justify-content-center">
  <Col xs={12} md={8} lg={6} className="p-4 border rounded bg-light shadow-sm">
    <h4 className="text-center mb-4">Book This Venue</h4>
    {message.text && (
      <div className={`alert alert-${message.type}`} role="alert">
        {message.text}
      </div>
    )}
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="dateFrom">
        <Form.Label>Date From</Form.Label>
        <Form.Control
          type="date"
          name="dateFrom"
          value={form.dateFrom}
          onChange={handleInputChange}
          required
          min={today}
        />
      </Form.Group>
      <Form.Group controlId="dateTo">
        <Form.Label>Date To</Form.Label>
        <Form.Control
          type="date"
          name="dateTo"
          value={form.dateTo}
          onChange={handleInputChange}
          required
          min={form.dateFrom}
          disabled={!form.dateFrom}
        />
      </Form.Group>
      <Form.Group controlId="guests">
        <Form.Label>Number of Guests</Form.Label>
        <Form.Control
          type="number"
          name="guests"
          value={form.guests}
          onChange={handleInputChange}
          required
          min="1"
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3 w-100">
        Book Now
      </Button>
    </Form>
  </Col>
</Row>

        )}
      </Container>
    );
  };

  export default VenueDetails;
