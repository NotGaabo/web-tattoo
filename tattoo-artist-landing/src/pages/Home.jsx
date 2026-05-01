import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Gallery from '../components/Gallery'
import Contact from '../components/Contact'
import './Home.css'

export default function Home() {
  return (
    <main className="home">
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Contact />
    </main>
  )
}
