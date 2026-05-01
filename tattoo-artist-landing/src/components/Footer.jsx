import { motion } from 'framer-motion'
import { FiInstagram, FiMail, FiPhone, FiArrowUp } from 'react-icons/fi'
import './Footer.css'

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-content">
        <div className="footer-section">
          <h3>MARCUS INK</h3>
          <p>Creating timeless art on the canvas of your skin.</p>
        </div>

        <div className="footer-section">
          <h4>CONTACT</h4>
          <div className="footer-links">
            <a href="mailto:marcus@ink.com">
              <FiMail size={16} />
              marcus@ink.com
            </a>
            <a href="tel:+1234567890">
              <FiPhone size={16} />
              +1 (234) 567-890
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>FOLLOW</h4>
          <div className="footer-socials">
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiInstagram size={20} />
            </motion.a>
          </div>
        </div>

        <motion.button
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowUp size={20} />
        </motion.button>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Marcus Ink. All rights reserved. | Art is identity.</p>
      </div>
    </motion.footer>
  )
}
