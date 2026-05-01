import { motion } from 'framer-motion'
import { FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi'
import './About.css'

export default function About() {
  const stats = [
    { icon: FiAward, label: 'Years Experience', value: '12+' },
    { icon: FiUsers, label: 'Clients Served', value: '2K+' },
    { icon: FiTrendingUp, label: 'Tattoos Created', value: '3K+' },
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
    <section id="about" className="about">
      <div className="about-container">
        <motion.div
          className="about-image"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop"
            alt="Marcus - Tattoo Artist"
          />
        </motion.div>

        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants}>
            <h2>ABOUT ME</h2>
            <p className="subtitle">Artist & Storyteller</p>
          </motion.div>

          <motion.p variants={itemVariants}>
            I'm Marcus, a tattoo artist dedicated to translating your vision into
            permanent art. With over a decade of experience, I specialize in custom
            designs that capture the essence of who you are.
          </motion.p>

          <motion.p variants={itemVariants}>
            Every tattoo I create is a collaboration. I listen to your story, your
            values, and your dreams—then transform them into ink that you'll carry
            with pride forever.
          </motion.p>

          <motion.div
            className="stats-grid"
            variants={itemVariants}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  className="stat-card"
                  whileHover={{ y: -5 }}
                >
                  <Icon size={28} className="stat-icon" />
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
