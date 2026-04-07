import React,{useRef} from 'react'
import './Css/Login.css'
import './Css/Authenticate.css'
import { useNavigate,useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage} from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';
import emailjs from'@emailjs/browser';
import axios from 'axios';
const Authenticate = () => {
    const [message,setMessage]=useState('');
    const navigate=useNavigate();
    const location=useLocation();
    const inputsRef = useRef([]);
    const mode=location.state?.mode;
    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        e.target.value = value;
        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };
    const handleSubmit = async () => {
        let otp = inputsRef.current.map(input => input.value).join("");
        console.log("OTP:", otp);
            if(mode=='signup'){
                try{
                    const email=localStorage.getItem('email');
                    const res=await axios.post('http://localhost:8860/Authenticate',{email,otp});
                    if(res.data.message==='Otp Expired' || res.data.message==='Invalid Otp'){
                        setMessage(res.data.message);
                        }
                    else{
                        setMessage('Otp Verified');
                        localStorage.setItem('token', res.data.token);
                        navigate('/Info');
                    }
                }
                catch(err){
                    console.log(err);
                }
            }
            else if(mode=='reset'){
                navigate('/Reset');
                }
        };
        const resendOtp=()=>{
            try{
                const otp=Math.floor(100000+Math.random()*900000)
                const email=localStorage.getItem('email');
                console.log(email);
                const templateParams = {
                    email: email,
                    passcode: otp,
                    time: "2 minutes"
                    };
                  emailjs.send(
                    import.meta.env.VITE_SERVICE_ID,
                    import.meta.env.VITE_TEMPLATE_ID,
                    templateParams,
                    import.meta.env.VITE_PUBLIC_KEY
                    )
                    .then(() => {
                        setMessage('Otp Send');
                        axios.post('http://localhost:8860/otp-store',{email,otp});
                        navigate('/Authenticate', { state: { mode: 'signup' } });
                    })

            }
            catch(err){
                console.log(err);
            }            
        }
  return (
            <div className='login-container'>
                { message && <div className="message">{message}</div>}
            <div className="login-card">
                <div className="logo"><FontAwesomeIcon icon={faMessage} style={{color: "rgb(21, 153, 32)",fontSize:'4rem',marginBottom:"30px"}} /></div>
                <p className='welcome'>Verify your Account</p>
                <p className='felicitate'>We have send a six digit code to you </p>
                <form className='auth-container'>
                     {[...Array(6)].map((_, index) => (
                    <input key={index} type="text"inputMode="numeric"maxLength="1" className="otp-input"
                        ref={(el) => inputsRef.current[index] = el}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                    ))}
                </form>
                <p style={{marginBottom:'40px',color:'grey'}}>Enter the 6-digit code</p>
                <button className='but-login' style={{marginBottom:'40px'}} onClick={handleSubmit}>Authenticate</button>
                <p style={{marginBottom:'10px',color:'grey'}}>Didn't receive the code</p>
                <button className='auth-button' onClick={resendOtp}>Resend Code</button>
            </div>
        </div>
  )
}

export default Authenticate