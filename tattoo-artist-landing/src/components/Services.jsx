import { motion } from 'framer-motion'
import { FiZap, FiTarget, FiShare2 } from 'react-icons/fi'
import './Services.css'

export default function Services() {
  const services = [
    {
      icon: FiTarget,
      title: 'Custom Design',
      description: 'Unique, personalized tattoo designs crafted specifically for you.',
    },
    {
      icon: FiZap,
      title: 'Clean Lines',
      description: 'Precision and detail in every stroke for timeless results.',
    },
    {
      icon: FiShare2,
      title: 'Aftercare Support',
      description: 'Complete guidance on tattoo care to ensure perfect healing.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section className="services">
      <div className="services-container">
        <motion.div
          className="services-header"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>WHAT I OFFER</h2>
          <p>Premium tattoo services designed for your satisfaction</p>
        </motion.div>

        <motion.div
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                className="service-card"
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className="service-icon">
                  <Icon size={32} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
