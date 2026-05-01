import { motion } from 'framer-motion'
import { FiArrowRight, FiCalendar } from 'react-icons/fi'
import './Hero.css'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="hero">
      <div className="hero-background">
        <motion.div
          className="blob blob-1"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="blob blob-2"
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 50, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1>
            INK YOUR
            <span className="gradient-text"> SOUL</span>
          </h1>
        </motion.div>

        <motion.p variants={itemVariants}>
          Turning your vision into permanent art. Each tattoo tells a story,
          and I'm here to help you tell yours.
        </motion.p>

        <motion.div
          className="hero-cta"
          variants={itemVariants}
        >
          <motion.button
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiCalendar size={18} />
            BOOK APPOINTMENT
          </motion.button>
          <motion.button
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowRight size={18} />
            EXPLORE WORK
          </motion.button>
        </motion.div>

        <motion.div
          className="hero-scroll"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p>Scroll to explore</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-image"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="image-placeholder">
          <img
            src="https://images.unsplash.com/photo-1590080876223-4b53e0a2bb87?w=600&h=700&fit=crop"
            alt="Artist showcase"
          />
        </div>
      </motion.div>
    </section>
  )
}
