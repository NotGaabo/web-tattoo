import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiInstagram } from 'react-icons/fi'
import './Contact.css'

export default function Contact() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>READY FOR YOUR NEXT INK?</h2>
          <p>Let's create something extraordinary together</p>
        </motion.div>

        <motion.div
          className="contact-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Contact Info */}
          <motion.div className="contact-info" variants={itemVariants}>
            <h3>GET IN TOUCH</h3>

            <div className="info-item">
              <FiMail size={24} />
              <div>
                <p className="info-label">Email</p>
                <a href="mailto:marcus@ink.com">marcus@ink.com</a>
              </div>
            </div>

            <div className="info-item">
              <FiPhone size={24} />
              <div>
                <p className="info-label">Phone</p>
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </div>
            </div>

            <div className="info-item">
              <FiMapPin size={24} />
              <div>
                <p className="info-label">Location</p>
                <p>New York, NY 10001</p>
              </div>
            </div>

            <div className="contact-socials">
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiInstagram size={20} />
                Instagram
              </motion.a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form className="contact-form" variants={itemVariants} onSubmit={(e) => e.preventDefault()}>
            <h3>SEND A MESSAGE</h3>

            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Your Email"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Tattoo Style/Design"
              />
            </div>

            <div className="form-group">
              <textarea
                placeholder="Tell me about your tattoo idea..."
                rows={5}
              />
            </div>

            <motion.button
              type="submit"
              className="btn-submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SEND MESSAGE
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
