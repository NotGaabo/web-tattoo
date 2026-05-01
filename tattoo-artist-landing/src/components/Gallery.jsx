import { motion } from 'framer-motion'
import './Gallery.css'

export default function Gallery() {
  const galleryItems = [
    { id: 1, category: 'Geometric', url: 'https://images.unsplash.com/photo-1590080876223-4b53e0a2bb87?w=400&h=400&fit=crop' },
    { id: 2, category: 'Realistic', url: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=400&fit=crop' },
    { id: 3, category: 'Abstract', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop' },
    { id: 4, category: 'Watercolor', url: 'https://images.unsplash.com/photo-1544376335-5a8de32b6a4f?w=400&h=400&fit=crop' },
    { id: 5, category: 'Portrait', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop' },
    { id: 6, category: 'Minimalist', url: 'https://images.unsplash.com/photo-1516997121675-19f67b415bed?w=400&h=400&fit=crop' },
  ]

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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="gallery" className="gallery">
      <div className="gallery-container">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>GALLERY</h2>
          <p>A showcase of creative expression and artistic mastery</p>
        </motion.div>

        <motion.div
          className="gallery-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="gallery-item"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="gallery-image">
                <img src={item.url} alt={item.category} />
                <motion.div
                  className="gallery-overlay"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span>{item.category}</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          className="gallery-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          VIEW FULL PORTFOLIO
        </motion.button>
      </div>
    </section>
  )
}
