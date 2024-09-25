import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';
import { API_BASE_URL } from '../BaseURL/api';

const UpdateVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [venue, setVenue] = useState({
    name: '',
    description: '',
    price: '',
    maxGuests: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/holidaze/venues/${id}`);
        setVenue(response.data);
      } catch (err) {
        setError('Failed to fetch venue details.');
      }
    };

    fetchVenueDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenue((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!user || !user.accessToken) {
      setError('Authorization token is missing.');
      setLoading(false);
      return;
    }

    try {
      const formattedPrice = parseFloat(venue.price);
      const formattedMaxGuests = parseInt(venue.maxGuests, 10);

      if (isNaN(formattedPrice) || formattedPrice <= 0) {
        throw new Error('Price must be a valid positive number.');
      }
      if (isNaN(formattedMaxGuests) || formattedMaxGuests <= 0) {
        throw new Error('Max Guests must be a valid positive number.');
      }

      await axios.put(`${API_BASE_URL}/holidaze/venues/${id}`, {
        name: venue.name,
        description: venue.description,
        price: formattedPrice,
        maxGuests: formattedMaxGuests
      }, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`, 
          'Content-Type': 'application/json',
        },
      });

      setSuccess('Venue updated successfully.');
      navigate('/profile');
    } catch (error) {
      console.error('Update failed:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update venue.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Venue</h2>
      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Venue Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={venue.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={venue.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            className="form-control"
            value={venue.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="maxGuests">Max Guests</label>
          <input
            type="number"
            id="maxGuests"
            name="maxGuests"
            className="form-control"
            value={venue.maxGuests}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Update Venue
        </button>
      </form>
    </div>
  );
};

export default UpdateVenue;
