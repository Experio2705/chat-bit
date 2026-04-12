import React from 'react'
import './Css/Login.css'
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage} from '@fortawesome/free-regular-svg-icons';
import emailjs from '@emailjs/browser';
import axios from 'axios';
const Login = () => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
   const [message,setMessage]=useState('');
    const navigate=useNavigate();
    const inputChange1=(e)=>{
        setEmail(e.target.value);
    }
    const inputChange2=(e)=>{
        setPassword(e.target.value);
    }
    const handleChange1=async()=>{
        const checkmail=/^[a-zA-Z0-9.]{5,}@gmail\.com$/;
        const checkpass=/^[a-zA-Z0-9@./$%&*()]{8,}$/;
        if(!checkmail.test(email) && !checkpass.test(password)){
            setMessage('Please Enter correct Info');
        }
        else if(!checkmail.test(email)){
            setMessage('Wrong Mail Format !');
        }
        else if(!checkpass.test(password)){
            setMessage('Wrong Pass format pass>8 !');
        }
        else{
            const res =await axios.post('https://chat-bit-xl7u.onrender.com/login',{email,password});
            if(res.data.message==='verified'){
                localStorage.setItem('token',res.data.token);
                localStorage.setItem('email',email);
                setMessage('Login Successfull !');
                navigate('/Chat',{replace:true});
            }
            else if(res.data.message==='invaliduser'){
                setMessage('Wrong Mail !');
            }
            else if(res.data.message==='invalidpass'){
                setMessage('Wrong Password !')
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
        navigate('/Register');
    }
    const handleChange3=async()=>{
            try{
                if(!email){
                    setMessage('Please enter email to receive otp');
                    return;
                }
                const res=await axios.post('https://chat-bit-xl7u.onrender.com/reset',{email});
                if(res.data.message==='notfound'){
                   setMessage('User not found !');
                   return
                }
                else if(res.data.message==='found'){
                    const otp=Math.floor(100000+Math.random()*900000)
                    const templateParams = {
                        email: email,
                        passcode: otp,
                        time: "1 minutes"
                     };
                    emailjs.send(
                        import.meta.env.VITE_SERVICE_ID,
                        import.meta.env.VITE_TEMPLATE_ID,
                        templateParams,
                        import.meta.env.VITE_PUBLIC_KEY
                        )
                    .then(async() => {
                        setMessage('Otp Send');
                        localStorage.setItem('email',email);
                        await axios.post('https://chat-bit-xl7u.onrender.com/otp-store',{email,otp});
                        navigate('/Authenticate', { state: { mode: 'reset' } });
                    })
                }
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
            <p className='welcome'>Welcome to ChatBit</p>
            <p className='felicitate'>Sign in to your account to continue</p>
            <form className='form'>
                <p className='email'>Email</p>
                <input className='ip-login' type='email' onChange={(e)=>inputChange1(e)} placeholder='Enter your email'></input>
                <p className='password'>Password</p>
                <input className='ip-login' type='password' onChange={(e)=>inputChange2(e)} placeholder='Enter your password'></input>
            </form>
            <button className='but-login' onClick={handleChange1}>Sign In</button>
            <div className="no-acc">
                <p>Don't have an account? </p>
                <p className='login-signup' onClick={handleChange2}style={{color:'rgb(21, 153, 32)'}}>Sign Up</p>
            </div>
            <div className="no-acc">
                <p>Reset Password : </p>
                <p className='login-signup' onClick={handleChange3}style={{color:'rgb(21, 153, 32)'}}>Reset</p>
            </div>
        </div>
    </div>
  )
}

export default Login