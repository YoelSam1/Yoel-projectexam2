import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Navbar from './Components/Navbar';
import VenueList from './Venue/VenueList';
import VenueDetails from './Venue/VenueDetails';
import CreateVenue from './Venue/CreateVenue';
import UpdateVenue from './Venue/UpdateVenue'; 
import Profile from './Pages/Profile';
import MyBookings from './Pages/MyBookings';
import Footer from './Components/Footer';
import './App.css';
import { AuthProvider } from './Authentication/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/venuelist" element={<VenueList />} />
          <Route path="/venues/:id" element={<VenueDetails />} />
          <Route path="/create-venue" element={<CreateVenue />} />
          <Route path="/update-venue/:id" element={<UpdateVenue />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<MyBookings />} /> 
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
};

export default App;
