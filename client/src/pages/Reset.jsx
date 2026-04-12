import React, { use } from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage} from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Reset = () => {
    const [message,setMessage]=useState('');
    const [rpassword,setPassword]=useState('');
    const [rcpassword,setCpassword]=useState('');
    const navigate=useNavigate();
    const inputChange3=(e)=>{
        setPassword(e.target.value);
    }
    const inputChange4=(e)=>{
        setCpassword(e.target.value);
    }
    const handleChange=async()=>{
            const checkpass=/^[a-zA-Z0-9@./$%&*()]{8,}$/;
            if(!checkpass.test(rpassword)){
                setMessage('Please Enter correct Info');
            }   
            else if(rpassword!==rcpassword){
                setMessage('Wrong Confirm Password !');
            }
            else{
                const email=localStorage.getItem('email');
                const res =await axios.post('https://chat-bit-xl7u.onrender.com/reset-pass',{rpassword,email});
                if(res.data.message==='updated'){
                    setMessage('Updated');
                    navigate('/Login');
                }
                else{
                    setMessage('Something went Wrong');
                }
            }
    }
  return (
        <div className='login-container'>
         { message && <div className="message">{message}</div>}
        <div className="login-card">
            <div className="logo"><FontAwesomeIcon icon={faMessage} style={{color: "rgb(21, 153, 32)",fontSize:'4rem',marginBottom:"30px"}} /></div>
            <p className='welcome'>Rest Yout Password</p>
            <p className='felicitate'>Enter new password to reset</p>
            <form className='form'>
                <p className='password'>Password</p>
                <input className='ip-login' type='password' placeholder='Create a password' onChange={(e)=>inputChange3(e)}></input>
                <p className='password'>Confirm Password</p>
                <input className='ip-login' type='password' placeholder='Confirm your password'onChange={(e)=>inputChange4(e)}></input>        
            </form>
            <button className='but-login' onClick={handleChange}>Reset</button>
        </div>
    </div>
  )
}

export default Reset