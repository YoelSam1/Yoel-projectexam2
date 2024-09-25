import React, { useState } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../BaseURL/api';

const CreateVenue = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState('');
  const [price, setPrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [rating, setRating] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [continent, setContinent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

    if (!name || !description || !price || !maxGuests || !address || !city || !zip || !country || !continent) {
      setError("Please fill in all required fields.");
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
      await axios.post(
        `${API_BASE_URL}/holidaze/venues`,
        {
          name,
          description,
          media: [media],
          price: parseFloat(price),
          maxGuests: parseInt(maxGuests),
          rating: parseFloat(rating),
          location: {
            address,
            city,
            zip,
            country,
            continent,
          },
        },
        config
      );
      setSuccess("Venue created successfully!");
      setName('');
      setDescription('');
      setMedia('');
      setPrice('');
      setMaxGuests('');
      setRating('');
      setAddress('');
      setCity('');
      setZip('');
      setCountry('');
      setContinent('');
    } catch (error) {
      setError(`Error creating venue: ${error.response?.data.message || error.message}`);
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="price" className="form-label">Price</label>
                <input
                  type="number"
                  id="price"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  step="0.01"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="maxGuests" className="form-label">Max Guests</label>
                <input
                  type="number"
                  id="maxGuests"
                  className="form-control"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
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
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  step="0.1"
                  max="5"
                  min="0"
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  value={media}
                  onChange={(e) => setMedia(e.target.value)}
                  placeholder="http://example.com/image.jpg"
                />
              </div>

              <h4 className="my-3">Location Details</h4>
              <div className="col-md-6">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  id="address"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  id="city"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="zip" className="form-label">Zip Code</label>
                <input
                  type="text"
                  id="zip"
                  className="form-control"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  id="country"
                  className="form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="continent" className="form-label">Continent</label>
                <input
                  type="text"
                  id="continent"
                  className="form-control"
                  value={continent}
                  onChange={(e) => setContinent(e.target.value)}
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
