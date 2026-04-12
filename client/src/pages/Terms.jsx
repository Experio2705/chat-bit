import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Line from '../components/Line'
import './Css/Terms.css'

const Terms = () => {
  return (
    <div>
      <Navbar />
      <Line />

      <section className='terms-main'>
        <h1>Terms & Conditions</h1>
        <p><strong>Last Updated:</strong> March 17, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By using ChatBit, you agree to these terms and conditions.</p>

        <h2>2. User Responsibilities</h2>
        <p>You agree to use ChatBit responsibly and not misuse the platform.</p>

        <h2>3. Account Information</h2>
        <p>You are responsible for maintaining the confidentiality of your account.</p>

        <h2>4. Prohibited Activities</h2>
        <ul>
          <li>Spamming or sending harmful content</li>
          <li>Impersonating others</li>
          <li>Violating any laws</li>
        </ul>

        <h2>5. Termination</h2>
        <p>We reserve the right to suspend or terminate accounts that violate our policies.</p>

        <h2>6. Changes to Terms</h2>
        <p>We may update these terms at any time.</p>

        <h2>7. Contact</h2>
        <p>Email: aryanshinde2705@gmail.com</p>
      </section>

      <Line />
      <Footer />
    </div>
  )
}

export default Terms