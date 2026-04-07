import React from 'react'
import './Css/HomePage.css'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Line from '../components/line'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage,faLock,faImage} from '@fortawesome/free-solid-svg-icons';
import socket from './socket.js'
import { useEffect } from 'react'
const HomePage = () => {
  const navigate=useNavigate();
  const handleChange1=()=>{
    navigate('/Register');
  }
  const handleChange2=()=>{
    navigate('/Login');
  }
  return (
    <div>
      <Navbar></Navbar>
      <Line></Line>
      <section className='Homepage-Main'>
        <p className='upper-p'>Simple,Secure,</p>
        <p className='lower-p'>Reliable Messaging</p>
        <p className='middle-p'>Stay connected with friends and family. Send messages, share moments, and keep in touch effortlessly.</p>
        <div className="but">
          <button className="start" onClick={()=>handleChange1()}>Start Messaging</button>
          <button className="Signin" onClick={()=>handleChange2()}>Sign In</button>
        </div>
        <p style={{fontSize:"1.6rem",textAlign:'center'}}>Why ChatBit?</p>
        <p style={{fontSize:"1rem",marginBottom:'70px',textAlign:'center'}}>Everything you need to know.</p>
        <div className="why-cards">
          <div className="why">
            <p style={{fontSize:'2.3rem',marginBottom:'10px'}}><FontAwesomeIcon icon={faMessage} style={{color: "rgb(99, 230, 190)",}} /></p>
            <p style={{color:'black',marginBottom:'10px'}}>Fast Messaging</p>
            <p style={{marginBottom:'20px',color:'grey'}}>Send and receive messages instantly</p>
            <p style={{fontSize:'1rem',color:'grey'}}>Chat with your contacts in real-time with our lightning-fast messaging platform</p>
          </div>
          <div className="why">
            <p style={{fontSize:'2.3rem',marginBottom:'10px'}}><FontAwesomeIcon icon={faLock} style={{color: "rgb(116, 192, 252)",}} /></p>
            <p style={{color:'black',marginBottom:'10px'}}>Private & Secure</p>
            <p style={{marginBottom:'20px',color:'grey'}}>Your messages are protected</p>
            <p style={{fontSize:'1rem',color:'grey'}}>We prioritize your privacy with secure messaging that keeps your conversations safe.</p>
          </div>
          <div className="why">
            <p style={{fontSize:'2.3rem',marginBottom:'10px'}}><FontAwesomeIcon icon={faImage} style={{color: "rgb(177, 151, 252)",}} /></p>
            <p style={{color:'black',marginBottom:'10px'}}>Share Status</p>
            <p style={{marginBottom:'20px',color:'grey'}}>Share your moments with status updates</p>
            <p style={{fontSize:'1rem',color:'grey'}}>Post photos and updates that disappear after 24 hours, just like your favorite apps.</p>
          </div>
        </div>
        <div className="ready">
          <p style={{fontSize:'2.5rem',fontWeight:'600',marginBottom:'10px'}}>Ready to Connect</p>
          <p style={{marginBottom:'20px'}}>Join ChatBit and start chatting with your friends today</p>
          <button className='but2' onClick={()=>handleChange1()}>Create Free Account</button>
        </div>
      </section>
      <Line></Line>
      <Footer></Footer>
    </div>
  )
}

export default HomePage