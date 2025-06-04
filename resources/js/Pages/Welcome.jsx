import '../../css/Welcome.css';
import React from 'react';
import { motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';
import int1 from "../../Welcome/int.jpg";
import int2 from "../../Welcome/int2.jpeg";
import int3 from "../../Welcome/int3.jpeg";


const Welcome = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const dashboardImages = [
   int1,
   int2,
   int3,

  ];

  const auth = usePage().props;

  return (
    <div className="main-wrapper">
      {/* Hero Section */}
      <motion.section
        className="hero-section d-flex align-items-center justify-content-center position-relative"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="hero-overlay position-absolute w-100 h-100"></div>
        <div className="container position-relative text-center">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <motion.h1
                className="hero-title display-1 fw-bold text-dark mb-4"
                variants={fadeInUp}
              >
                Good Guys
              </motion.h1>
              <motion.p
                className="hero-subtitle lead fs-3 text-muted mb-5"
                variants={fadeInUp}
              >
                Transform Your Space with Exceptional Interior Design
              </motion.p>
              <div
                className="d-flex flex-column flex-sm-row gap-3 justify-content-center z-50"  style={{ zIndex: 9999 }}
                variants={fadeInUp}
              >
                {auth.user ? (
                  <Link
                    href={route('login')}
                  >
                    Dashboard
                  </Link>

                ) : (

                  <Link
                    className="btn btn-primary btn-lg px-5 py-3 fs-5 fw-semibold shadow-lg" style={{ zIndex: 9999 }}
                    href={route('dashboard')}
                  >
                    Login
                  </Link>
                )}

              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Dashboard Gallery Section */}
      <motion.section
        className="py-5 dashboard-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="container py-5">
          <motion.h2
            className="display-2 fw-bold text-dark text-center mb-5"
            variants={fadeInUp}
          >
            Our Gallery
          </motion.h2>
          <div className="row g-4">
            {dashboardImages.map((image, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <motion.div
                  className="dashboard-card position-relative overflow-hidden rounded-3 shadow-lg h-100"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={image}
                    alt={`Dashboard ${index + 1}`}
                    className="img-fluid dashboard-image"
                  />
                  <div className="dashboard-overlay position-absolute w-100 h-100 top-0 start-0 d-flex align-items-end">
                    <div className="p-4 text-white">
                      <h3 className="h4 fw-semibold">Design Suite {index + 1}</h3>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

     

      {/* Floating Animation Elements */}
      <div className="floating-elements position-fixed w-100 h-100 top-0 start-0" style={{ pointerEvents: 'none', zIndex: 1 }}>
        <motion.div
          className="floating-dot floating-dot-1 position-absolute bg-primary rounded-circle"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="floating-dot floating-dot-2 position-absolute bg-secondary rounded-circle"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="floating-dot floating-dot-3 position-absolute bg-success rounded-circle"
          animate={{
            y: [0, -15, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Footer */}
      <motion.footer
        className="bg-dark text-white footer-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <motion.div variants={fadeInUp}>
                <h3 className="h2 fw-bold mb-4 text-primary">Good Guys Interior Design</h3>
                <p className="text-light mb-4 fs-5">
                  "Creating Beautiful Spaces, Building Better Lives"
                </p>
                <p>
                  Your trusted partner in transforming spaces into extraordinary experiences.
                </p>
              </motion.div>
            </div>

            <div className="col-lg-4 col-12">
              <motion.div variants={fadeInUp}>
                <h4 className="h3 fw-semibold mb-4 text-primary">Contact Information</h4>
                <div className="text-light fs-6">
                  <p className="mb-2">📍 Badambagh, Sopore, Jammu & Kashmir</p>
                </div>
              </motion.div>
            </div>

         
          </div>

          <motion.div
            className="border-top border-secondary mt-5 pt-4 text-center text-primary"
            variants={fadeInUp}
          >
            <p className="mb-2">&copy; 2025 Good Guys Interior Design. All rights reserved.</p>
            <p className="mb-0">Designed & Developed by <a href='mailto:info@pysync.com' className="text-white">Py.Sync Pvt Ltd </a></p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Welcome;