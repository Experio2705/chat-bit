import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Line from '../components/line'
import './Css/Support.css'

const Support = () => {
  return (
    <div>
      <Navbar />
      <Line />

      <section className='support-main'>
        <h1>Support</h1>
        <p className="subtitle">We're here to help you with ChatBit</p>

        <h2>📩 Contact Us</h2>
        <p>If you face any issues or have questions, reach out to us:</p>
        <p><strong>Email:</strong> aryanshinde2705@gmail.com</p>

        <h2>⚡ Common Issues</h2>
        <ul>
          <li>OTP not received</li>
          <li>Login or signup problems</li>
          <li>Profile image upload issues</li>
          <li>Messages not loading</li>
        </ul>

        <h2>🛠 Troubleshooting</h2>
        <ul>
          <li>Check your internet connection</li>
          <li>Make sure your phone number is correct</li>
          <li>Try refreshing the page</li>
        </ul>

        <h2>⏱ Response Time</h2>
        <p>We usually respond within 24 hours.</p>
      </section>

      <Line />
      <Footer />
    </div>
  )
}

export default Support