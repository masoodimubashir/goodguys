import React, { useState, useEffect } from 'react';
import { MapPin, Menu, X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import '../../css/Welcome.css';

const Welcome = ({ auth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="welcome-page">
      {/* Combined Hero and About Section */}
      <section className="combined-section">
        <div className="container">
          <div className="content-row">
            <div className="content-col left-col">
              <div className="text-container">
                <h1 className="hero-title">Transforming Spaces with <br /><span className="highlight">Elegance & Innovation</span></h1>
                
                <div className="location-container">
                  <MapPin size={20} className="location-icon" />
                  <p className="location-text">Srinagar, Jammu and Kashmir, Sopore</p>
                </div>
                
                <div className="about-container">
                  <h2 className="about-title">About Us</h2>
                  <p className="about-text">
                    At <strong>Good Guys</strong>, we believe that every space has the potential to inspire.
                    With years of experience in crafting both residential and commercial interiors, our team delivers
                    high-end, customized designs that blend functionality with sophistication.
                  </p>
                  <p className="about-subtext">
                    Whether it's a home, office, or retail space, we bring your vision to life with precision and creativity.
                  </p>
                </div>
                
                <div className="action-container">
                  {auth.user ? (
                    <Link href={route('dashboard')} className="action-button primary">Go to Dashboard</Link>
                  ) : (
                    <Link href={route('login')} className="action-button outline">Login</Link>
                  )}
                </div>
              </div>
            </div>
            
            <div className="content-col right-col">
              <div className="image-container">
                <div className="circle-decoration top-left"></div>
                <img src="/images/interior-sample.jpg" alt="Interior Design" className="feature-image" />
                <div className="circle-decoration bottom-right"></div>
              </div>
              
              <div className="credit-container">
                <div className="credit-badge">
                  <small className="credit-text">Developed by Py.Sync Pvt Ltd</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;