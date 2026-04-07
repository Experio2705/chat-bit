import React from 'react'
import './Css/Footer.css'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage} from '@fortawesome/free-regular-svg-icons';
const Footer = () => {
  const navigate = useNavigate();
  const handlePrivacy=()=>{
    navigate('/Privacy');
  }
  const handleTerms=()=>{
    navigate('/Terms');
  }
    const handleSupport=()=>{
    navigate('/Support');
  }
  return (
    <div className='cont'>
        <div className="namelogo"><FontAwesomeIcon icon={faMessage} style={{color: "rgb(21, 153, 32)",fontSize:'1.5rem',marginRight:"6px"}} />&copy; 2026 ChatBit. All rights reserved</div>
        <div className="privacy" onClick={handlePrivacy}>Privacy</div>
        <div className="terms" onClick={handleTerms}>Terms</div>
        <div className="support" onClick={handleSupport}>Support</div>
    </div>
  )
}

export default Footer