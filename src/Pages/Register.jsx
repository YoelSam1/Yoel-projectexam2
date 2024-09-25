import React, { useState } from 'react';
import { registerUser } from '../Authentication/authApi'; 
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
    venueManager: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(stud\.)?noroff.no$/;
    return emailPattern.test(email);
  };

  const isValidName = (name) => {
    const namePattern = /^[a-zA-Z0-9_]+$/; 
    return namePattern.test(name);
  };

  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setSuccess(null); 

    // Validate name
    if (!isValidName(formData.name)) {
      setError('Name can only contain letters, numbers, and underscores (_).');
      return;
    }

    // Validate email
    if (!isValidEmail(formData.email)) {
      setError('Email must be a valid stud.noroff.no or noroff.no address.');
      return;
    }

    // Validate password
    if (!isValidPassword(formData.password)) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate avatar (if provided)
    if (formData.avatar && !isValidURL(formData.avatar)) {
      setError('Avatar must be a valid URL.');
      return;
    }

    try {
      await registerUser(formData); // Removed unused 'data' variable
      setSuccess('Registration successful!');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: '',
        venueManager: false,
      }); 
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <Container className="my-5 d-flex justify-content-center">
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow">
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </Form.Group>

            <Form.Group controlId="formAvatar" className="mb-3">
              <Form.Label>Avatar URL (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="Enter avatar URL"
              />
            </Form.Group>

            <Form.Group controlId="formVenueManager" className="mb-3">
              <Form.Check
                type="checkbox"
                name="venueManager"
                checked={formData.venueManager}
                onChange={handleChange}
                label="Venue Manager"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
