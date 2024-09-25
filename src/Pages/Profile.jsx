import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../BaseURL/api';

// URL of the default avatar image
const defaultAvatarUrl = 'https://icons.veryicon.com/png/o/miscellaneous/common-icons-31/default-avatar-2.png';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [newAvatar, setNewAvatar] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setError('Failed to fetch profile or venues');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      // Update the avatar URL
      await axios.put(`${API_BASE_URL}/holidaze/profiles/${user.name}/media`, {
        avatar: newAvatar,
      }, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Update the profile state with the new avatar URL
      setProfile(prevProfile => ({
        ...prevProfile,
        avatar: newAvatar,
      }));
  
      // Update the success message
      setSuccess('Avatar updated successfully.');
      setNewAvatar('');
    } catch (err) {
      setError('Failed to update avatar.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async (venueId) => {
    try {
      await axios.delete(`${API_BASE_URL}/holidaze/venues/${venueId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setVenues(venues.filter(venue => venue.id !== venueId));
    } catch (err) {
      setError('Failed to delete venue');
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">My Profile</h1>

      {/* Profile Information */}
      {profile && (
        <div className="row">
          <div className="col-12 text-center mb-4">
            <img
              src={profile.avatar || defaultAvatarUrl}
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
              <button type="submit" className="btn btn-success w-100" disabled={loading}>
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
                  src={venue.media[0] || 'https://via.placeholder.com/400x200'}
                  className="card-img-top"
                  alt={venue.name}
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
