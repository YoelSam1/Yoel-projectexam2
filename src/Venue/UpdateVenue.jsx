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
    maxGuests: '',
    media: [],
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
      [name]: value,
    }));
  };

  const handleMediaChange = (index, value) => {
    const updatedMedia = [...venue.media];
    updatedMedia[index] = value;
    setVenue((prev) => ({
      ...prev,
      media: updatedMedia,
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

      // Validation
      if (isNaN(formattedPrice) || formattedPrice <= 0) {
        throw new Error('Price must be a valid positive number.');
      }
      if (isNaN(formattedMaxGuests) || formattedMaxGuests <= 0) {
        throw new Error('Max Guests must be a valid positive number.');
      }

      // Update venue
      await axios.put(`${API_BASE_URL}/holidaze/venues/${id}`, {
        name: venue.name,
        description: venue.description,
        media: venue.media.filter((url) => url.trim() !== ''),
        price: formattedPrice,
        maxGuests: formattedMaxGuests,
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
      <h2 className="text-center mb-4">Update Venue</h2>
      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      {venue.name ? (
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Venue Name</label>
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
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={venue.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                value={venue.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="maxGuests" className="form-label">Max Guests</label>
              <input
                type="number"
                id="maxGuests"
                name="maxGuests"
                className="form-control"
                value={venue.maxGuests}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="media" className="form-label">Media URLs</label>
            {venue.media.map((mediaUrl, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="url"
                  className="form-control"
                  value={mediaUrl}
                  onChange={(e) => handleMediaChange(index, e.target.value)}
                  placeholder="http://example.com/image.jpg"
                  title="Please enter a valid URL"
                  required
                />
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-success d-block mx-auto" disabled={loading}>
            Update Venue
          </button>
        </form>
      ) : (
        <p>Loading venue details...</p>
      )}
    </div>
  );
};

export default UpdateVenue;
