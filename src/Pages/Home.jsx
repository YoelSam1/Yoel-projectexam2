import React from 'react';
import '../CustomStyle/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Holidaze</h1>
          <p className="hero-subtitle">Discover global venues and book your dream Hotel.</p>
          <a href="/venuelist" className="btn btn-primary btn-lg">View Venues</a>
        </div>
      </header>

      <section className="features mt-5">
        <div className="container">
          <h2>Why Book with Us?</h2>
          <div className="row">
            <div className="col-md-4 feature">
              <h3>Discover Venues</h3>
              <p>Explore a wide variety of venues suited for any occasion, worldwide.</p>
            </div>
            <div className="col-md-4 feature">
              <h3>Easy Booking</h3>
              <p>Book your venue in just a few clicks with our easy-to-use platform.</p>
            </div>
            <div className="col-md-4 feature">
              <h3>Great Deals</h3>
              <p>Find the best deals and offers for your event and travel needs.</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
