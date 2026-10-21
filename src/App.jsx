import Hero from './components/Hero.jsx'
import Calculator from './components/Calculator.jsx'
import BeforeAfter from './components/BeforeAfter.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Hero />
      <main>
        <Calculator />
        <BeforeAfter />
      </main>
      <Footer />
    </>
  )
}
