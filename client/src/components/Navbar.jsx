import React from 'react'
import './Css/Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage} from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate=useNavigate();
  const handleChange1=()=>{
    navigate('/Register');
  }
  const handleChange2=()=>{
    navigate('/Login');
  }
  return (
    <div className='container' >
        <div className="name-logo"><FontAwesomeIcon icon={faMessage} style={{color: "rgb(21, 153, 32)",fontSize:'2rem',marginRight:"6px"}} />ChatBit</div>
        <div className="signin" onClick={()=>handleChange2()}>Sign In</div>
        <div className="login" onClick={()=>handleChange1()}>Get Started</div>
    </div>
  )
}

export default Navbar