import React, { useState } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../BaseURL/api';

const CreateVenue = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    media: '',
    price: '',
    maxGuests: '',
    rating: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    continent: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!user || !user.accessToken) {
      setError("You need to be logged in to create a venue.");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      const venueData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        maxGuests: parseInt(formData.maxGuests),
        rating: formData.rating ? parseFloat(formData.rating) : null,
        media: formData.media ? [formData.media] : undefined,
        location: {
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
          country: formData.country,
          continent: formData.continent,
        },
      };

      await axios.post(`${API_BASE_URL}/holidaze/venues`, venueData, config);
      setSuccess("Venue created successfully!");
      // Clear form fields after submission
      setFormData({
        name: '',
        description: '',
        media: '',
        price: '',
        maxGuests: '',
        rating: '',
        address: '',
        city: '',
        zip: '',
        country: '',
        continent: '',
      });
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
      setError(`Error creating venue: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="p-4 bg-light rounded">
            <h1 className="text-center mb-4">Create a New Venue</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">Venue Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  pattern="[a-zA-Z0-9_]+"
                  title="Invalid name. Only letters, numbers, and underscores are allowed."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="price" className="form-label">Price</label>
                <input
                  type="number"
                  id="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="1"
                  min="1"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="maxGuests" className="form-label">Max Guests</label>
                <input
                  type="number"
                  id="maxGuests"
                  className="form-control"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="rating" className="form-label">Rating</label>
                <input
                  type="number"
                  id="rating"
                  className="form-control"
                  value={formData.rating}
                  onChange={handleChange}
                  step="1"
                  max="5"
                  min="1"
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="media" className="form-label">Media (URL)</label>
                <input
                  type="url"
                  id="media"
                  className="form-control"
                  value={formData.media}
                  onChange={handleChange}
                  placeholder="http://example.com/image.jpg"
                  title="Please enter a valid URL"
                  required
                />
              </div>

              <h4 className="my-3">Location Details</h4>
              <div className="col-md-6">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  id="address"
                  pattern="[a-zA-Z0-9_]+"
                  title="Invalid address. Only letters, numbers, and underscores are allowed."
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  id="city"
                  pattern="[A-Za-z\s\-']+"
                  title="Invalid city name. Only letters, spaces, hyphens, and apostrophes are allowed."
                  className="form-control"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="zip" className="form-label">Zip Code</label>
                <input
                  type="number"
                  id="zip"
                  className="form-control"
                  value={formData.zip}
                  onChange={handleChange}
                  step="1"
                  min="1"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  id="country"
                  pattern="[A-Za-z\s\-']+"
                  title="Invalid continent name. Only letters, spaces, hyphens, and apostrophes are allowed."
                  className="form-control"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="continent" className="form-label">Continent</label>
                <input
                  type="text"
                  id="continent"
                  pattern="[A-Za-z\s\-']+"
                  title="Invalid continent name. Only letters, spaces, hyphens, and apostrophes are allowed."
                  className="form-control"
                  value={formData.continent}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 text-center">
                <button type="submit" className="btn btn-primary btn-lg mt-4" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Venue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVenue;
