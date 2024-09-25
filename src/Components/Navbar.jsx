import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../Authentication/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../BaseURL/api';

// URL of the default avatar image
const defaultAvatarUrl = 'https://icons.veryicon.com/png/o/miscellaneous/common-icons-31/default-avatar-2.png';

const NavbarComponent = () => {
  const { user, logout } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/holidaze/profiles/${user.name}`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          });
          setAvatar(response.data.avatar || ''); // Set avatar to empty string if none is provided
        } catch (err) {
          console.error('Failed to fetch user profile', err);
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Holidaze</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav className="d-flex flex-nowrap">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/venuelist">Venues</Nav.Link>
            {user && (
              <Nav.Link as={NavLink} to="/my-bookings">My Bookings</Nav.Link>
            )}
          </Nav>
          <Nav className="d-flex flex-nowrap align-items-center">
            {!user ? (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/profile" className="d-flex align-items-center text-light">
                  <div className="bg-secondary rounded-circle p-1 me-2">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile Avatar"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px' }}
                      />
                    ) : (
                      <img
                        src={defaultAvatarUrl}
                        alt="Default Avatar"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px' }}
                      />
                    )}
                  </div>
                  <span className="me-2">{user.name}</span>
                </Nav.Link>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
