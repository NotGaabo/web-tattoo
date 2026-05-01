import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiInstagram, FiPhone, FiMail } from 'react-icons/fi'
import './Header.css'

export default function Header() {
  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-container">
        <Link to="/" className="logo">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="logo-text">MARCUS</span>
            <span className="logo-accent">INK</span>
          </motion.div>
        </Link>

        <nav className="nav-links">
          <motion.a href="#about" whileHover={{ color: '#0066ff' }}>
            ABOUT
          </motion.a>
          <motion.a href="#gallery" whileHover={{ color: '#0066ff' }}>
            GALLERY
          </motion.a>
          <motion.a href="#contact" whileHover={{ color: '#0066ff' }}>
            CONTACT
          </motion.a>
        </nav>

        <div className="header-socials">
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, color: '#0066ff' }}
            whileTap={{ scale: 0.95 }}
          >
            <FiInstagram size={20} />
          </motion.a>
          <motion.a
            href="tel:+1234567890"
            whileHover={{ scale: 1.2, color: '#0066ff' }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPhone size={20} />
          </motion.a>
        </div>
      </div>
    </motion.header>
  )
}
