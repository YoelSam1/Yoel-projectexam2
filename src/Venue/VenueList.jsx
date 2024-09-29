import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../BaseURL/api';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { debounce } from 'lodash';
import defaultImage from '../Assets/images/Sun.png';

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/holidaze/venues`);
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();

    // Preload the default image
    const preloadImage = new Image();
    preloadImage.src = defaultImage;

  }, []);

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  const handleSearch = (event) => {
    debouncedSearch(event.target.value);
  };

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Row className="mb-4">
        <Col className="text-center mt-4">
          <h1>Check out our venues below</h1>
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Search for a venue..."
              onChange={handleSearch}
              className="mx-auto search-width mt-5"
            />
          </Form.Group>
          <hr className="my-4 mt-5" />
        </Col>
      </Row>  
      <Row>
        {filteredVenues.map((venue) => ( 
          <Col md={4} key={venue.id} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={venue.media.length > 0 ? venue.media[0] : defaultImage}
                className='venuecard1'
                onError={(e) => {
                  e.target.src = defaultImage; 
                  e.target.alt = 'Default Image'; 
                }}
              />
              <Card.Body>
                <Card.Title>{venue.name}</Card.Title>
                <Card.Text>{venue.description}</Card.Text>
                <Card.Text>
                  <strong>Price:</strong> ${venue.price} / night
                </Card.Text>
                <Link to={`/venues/${venue.id}`}>
                  <Button variant="primary">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VenueList;
