import React from 'react'
import './Css/Privacy.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Line from '../components/Line'
const Privacy = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Line></Line>
      <section className='privacy-main' >
        <h1>Privacy Policy</h1>
        <p><strong>Last Updated:</strong> March 17, 2026</p>

        <h2>1. Introduction</h2>
        <p>Welcome to ChatBit. Your privacy is important to us.</p>

        <h2>2. Information We Collect</h2>
        <ul>
            <li>Username</li>
            <li>Phone number</li>
            <li>Profile picture</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use your data to provide and improve our services.</p>

        <h2>4. Data Security</h2>
        <p>We use secure systems to protect your data.</p>

        <h2>5. Contact</h2>
        <p>Email: aryanshinde2705@gmail.com</p>
      </section>
      <Line></Line>
    <Footer></Footer>
    </div>
  )
}

export default Privacy