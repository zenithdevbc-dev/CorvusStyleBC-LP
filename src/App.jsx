import Hero from './components/Hero.jsx'
import BeforeAfter from './components/BeforeAfter.jsx'
import Calculator from './components/Calculator.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Hero />
      <main>
        <BeforeAfter />
        <Calculator />
      </main>
      <Footer />
    </>
  )
}
