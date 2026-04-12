import React, { use } from 'react'
import './Css/Login.css'
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage} from '@fortawesome/free-regular-svg-icons';
const Register = () => {
    const navigate=useNavigate();
    const [email,setEmail]=useState('');
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [cpassword,setCpassword]=useState('');
    const [terms,setTerms]=useState(false);
    const [message,setMessage]=useState('');
    const inputChange1=(e)=>{
        setUsername(e.target.value);
    }
    const inputChange2=(e)=>{
        setEmail(e.target.value);
    }    
    const inputChange3=(e)=>{
        setPassword(e.target.value);
    }
    const inputChange4=(e)=>{
        setCpassword(e.target.value);
    }
    const inputChange5=()=>{
        setTerms(!terms);
    }
    const handleChange1=async()=>{
        const checkmail=/^[a-zA-Z0-9.]{5,}@gmail\.com$/;
        const checkpass=/^[a-zA-Z0-9@./$%&*()]{8,}$/;
        const checkuser=/^[a-zA-Z0-9@./$%&*()]{1,}$/;
        if(!checkmail.test(email) && !checkpass.test(password)){
            setMessage('Please Enter correct Info');
        }
        else if(!checkuser.test(username)){
            setMessage('Please Enter username !');
        }
        else if(!checkmail.test(email)){
            setMessage('Wrong Mail Format !');
        }
        else if(!checkpass.test(password)){
            setMessage('Wrong Pass format pass>8 !');
        }
        else if(password!==cpassword){
            setMessage('Wrong Confirm Password !');
        }
        else if(terms==false){
            setMessage('Please Click on terms and Conditions');
        }
        else{
            try{
                const otp=Math.floor(100000+Math.random()*900000)
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
                    .then(async() => {
                        setMessage('Otp Send');
                        await axios.post('https://chat-bit-xl7u.onrender.com/Register',{email,password});
                        await axios.post('https://chat-bit-xl7u.onrender.com/otp-store',{email,otp});
                        localStorage.setItem('email',email);
                        navigate('/Authenticate', { state: { mode: 'signup' } });
                    })

            }
            catch(err){
                console.log(err);
            }
        }
    }
    useEffect(()=>{
        if(message){
            const timer=setTimeout(()=>{
                setMessage('');
            },3000);
            return ()=>clearTimeout(timer);
        }
    },[message])
    const handleChange2=()=>{

        navigate('/Login')
    }
  return (
        <div className='login-container'>
            { message && <div className="message">{message}</div>}
            <div className="login-card">
                <div className="logo"><FontAwesomeIcon icon={faMessage} style={{color: "rgb(21, 153, 32)",fontSize:'4rem',marginBottom:"30px"}} /></div>
                <p className='welcome'>Create your Account</p>
                <p className='felicitate'>Sign Up to create your account </p>
                <form className='form'>
                    <p className='email' >Username</p>
                    <input className='ip-login' type='text' placeholder='Enter your username' onChange={(e)=>inputChange1(e)}></input>
                    <p className='email'>Email</p>
                    <input className='ip-login' type='email' placeholder='Enter your Email (example@gmail.com)' onChange={(e)=>inputChange2(e)}></input>
                    <p className='password'>Password</p>
                    <input className='ip-login' type='password' placeholder='Create a password' onChange={(e)=>inputChange3(e)}></input>
                    <p className='password'>Confirm Password</p>
                    <input className='ip-login' type='password' placeholder='Confirm your password'onChange={(e)=>inputChange4(e)}></input>
                    <input type="checkbox" onChange={()=>inputChange5()} required />
                    <span style={{marginBottom:'30px'}}> I agree to Terms & Conditions</span>
                </form>
                <button className='but-login' style={{marginTop:'30px'}} onClick={handleChange1}>Sign Up</button>
                <div className="no-acc">
                    <p>Already have an account? </p>
                    <p className='login-signup' onClick={handleChange2} style={{color:'rgb(21, 153, 32)'}}>Sign In</p>
                </div>
            </div>
        </div>
  )
}

export default Register