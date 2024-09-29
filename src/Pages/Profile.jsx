import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../BaseURL/api';
import defaultImage from '../Assets/images/Sun.png'; 
import defaultAvatar from '../Assets/images/default-avatar.png'; 

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [newAvatar, setNewAvatar] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user && user.accessToken) {
      const fetchProfile = async () => {
        try {
          const profileResponse = await axios.get(`${API_BASE_URL}/holidaze/profiles/${user.name}`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          });
          setProfile(profileResponse.data);

          const venuesResponse = await axios.get(`${API_BASE_URL}/holidaze/venues`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
            params: { _owner: true },
          });

          // Filter venues created by the logged-in user
          const userCreatedVenues = venuesResponse.data.filter(venue => venue.owner && venue.owner.email === user.email);
          setVenues(userCreatedVenues);
        } catch (err) {
          // Improved error handling
          if (err.response) {
            setError(err.response.data.message || 'Failed to fetch profile or venues.');
          } else if (err.request) {
            setError('No response received from the server.');
          } else {
            setError('Error: ' + err.message);
          }
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      // Validate URL
      const urlPattern = new RegExp('^(http|https)://');
      if (!urlPattern.test(newAvatar)) {
        throw new Error('Please enter a valid URL.');
      }

      // Update the avatar URL
      await axios.put(`${API_BASE_URL}/holidaze/profiles/${user.name}/media`, {
        avatar: newAvatar,
      }, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      setProfile(prevProfile => ({
        ...prevProfile,
        avatar: newAvatar,
      }));
  
      setSuccess('Avatar updated successfully.');
      setNewAvatar('');
    } catch (err) {
      // Improved error handling for avatar update
      if (err.response) {
        setError(err.response.data.message || 'Failed to update avatar.');
      } else if (err.request) {
        setError('No response received from the server.');
      } else {
        setError('Error: ' + err.message);
      }
    }
  };

  const handleDelete = async (venueId) => {
    try {
      await axios.delete(`${API_BASE_URL}/holidaze/venues/${venueId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setVenues(venues.filter(venue => venue.id !== venueId));
    } catch (err) {
      // Improved error handling for delete
      if (err.response) {
        setError(err.response.data.message || 'Failed to delete venue');
      } else if (err.request) {
        setError('No response received from the server.');
      } else {
        setError('Error: ' + err.message);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">My Profile</h1>

      {/* Profile Information */}
      {profile && (
        <div className="row">
          <div className="col-12 text-center mb-4">
            <img
              src={profile.avatar || defaultAvatar} 
              alt="Avatar"
              className="img-fluid rounded-circle mx-auto d-block avatar"
            />
          </div>
          <div className="col-12 text-center">
            <h2 className="h4">{profile.name}</h2>
            <p className="mb-1">Email: {profile.email}</p>
            <p>Venue Manager: {profile.venueManager ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}

      {/* Update Avatar Form */}
      <div className="d-flex justify-content-center mb-5">
        <div className="card shadow-sm w-100 mx-auto custom-card">
          <div className="card-body">
            <form onSubmit={handleAvatarUpdate}>
              <input
                type="url"
                id="newAvatar"
                value={newAvatar}
                onChange={(e) => setNewAvatar(e.target.value)}
                className="form-control mb-3"
                placeholder="Enter new avatar URL"
                required
              />
              <button type="submit" className="btn btn-success w-100">
                Update Avatar
              </button>
              {success && <div className="alert alert-success mt-2">{success}</div>}
              {error && <div className="alert alert-danger mt-2">{error}</div>}
            </form>
          </div>
        </div>
      </div>

      {/* Horizontal Line */} 
      <hr /> 

      {/* Create Venue Button */}
      <div className="mb-4 text-center">
        <Link to="/create-venue">
          <button className="btn btn-primary">Create Venue</button>
        </Link>
      </div>

      {/* Venues List */}
      <h2 className="text-center mb-4">My Venues</h2>
      {venues.length > 0 ? (
        <div className="row">
          {venues.map(venue => (
            <div key={venue.id} className="col-12 col-sm-6 col-md-4 mb-4">
              <div className="card">
                <img
                  src={venue.media.length > 0 ? venue.media[0] : defaultImage} 
                  className="card-img-top venuecard1"
                  alt={venue.name}
                  onError={(e) => {
                    e.target.src = defaultImage;
                    e.target.alt = 'Default Image';
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{venue.name}</h5>
                  <p className="card-text">{venue.description}</p>
                  <p className="card-text"><strong>Price:</strong> ${venue.price}</p>
                  <p className="card-text"><strong>Max Guests:</strong> {venue.maxGuests}</p>
                  <div className="d-flex justify-content-between">
                    <Link to={`/update-venue/${venue.id}`}>
                      <button className="btn btn-success">Update</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(venue.id)}
                      className="btn btn-danger"
                    >
                      Delete  
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">You have not created any venues yet.</p>
      )}
    </div>
  );
};

export default Profile;
