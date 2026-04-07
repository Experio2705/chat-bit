import React from 'react'
import './Css/Info.css';
import profileImg from '../assets/Profile.png'
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage} from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

const Info = () => {
    const navigate=useNavigate();
    const [message,setMessage]=useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dname,setDname]=useState('');
    const [bio,setBio]=useState('');
    const [pnumber,setPnumber]=useState('');
    const [location,setLocation]=useState('');
    const handleSubmit=async()=>{
        if(!image){
            return setMessage('Please upload profile pic !')
        }
        else if(!dname){
            return setMessage('Please enter name !')
        }
        else if(!bio){
            return setMessage('Please enter bio !')
        }
        else if(!pnumber){
            return setMessage('Please enter mobile number !')
        }
        else if(!location){
            return setMessage('please enter your location !')
        }
        else{
            const token=localStorage.getItem('token');
            console.log(token);
            const formData=new FormData();
            formData.append("image", image);
            formData.append("dname", dname);
            formData.append("bio", bio);
            formData.append("pnumber", pnumber);
            formData.append("location", location);
            try{
                await axios.post('http://localhost:8860/Info',formData,{headers:{Authorization:`Bearer ${token}`}});
                navigate('/Chat');
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };
    const inputChange1=(e)=>{
        setDname(e.target.value);
    }
    const inputChange2=(e)=>{
        setBio(e.target.value);
    }
    const inputChange3=(e)=>{
        setPnumber(e.target.value);
    }
    const inputChange4=(e)=>{
        setLocation(e.target.value);
    }
  return (
        <div className='login-container'>
            { message && <div className="message">{message}</div>}
            <div className="login-card">
                <div className="logo"><FontAwesomeIcon icon={faMessage} style={{color: "rgb(21, 153, 32)",fontSize:'4rem',marginBottom:"30px"}} /></div>
                <p className='welcome'>Complete your profile</p>
                <p className='felicitate'>Add information to personalize your ChatBit experience</p>
                <form className='form'>
                    <div className="image-upload">
                      <label htmlFor="file-input" className="upload-box">
                            {preview ? (
                                <img src={preview} alt="preview" className="preview-img" />
                                    ) : (
                                <img src={profileImg} alt="preview" className="preview-img" />
                            )}
                        </label>
                    <input id="file-input"  type="file"   accept="image/*" onChange={handleImageChange} hidden/>
                </div>
                    <p style={{marginBottom:'20px',colr:'grey'}}>Click the profile icon to upload a profile pictur</p>
                    <p className='email'>Display Name</p>
                    <input className='ip-login' type='text'onChange={(e)=>inputChange1(e)} placeholder='Enter your username'></input>
                    <p className='email'>Bio</p>
                    <input className='ip-login' style={{height:'20px'}} type='text' onChange={(e)=>inputChange2(e)} placeholder='Tell us about yourself'></input>
                    <p className='password'>Phone number</p>
                    <input className='ip-login' type='text' inputMode='numeric' onChange={(e)=>inputChange3(e)} placeholder='Enter your phone number'></input>
                    <p className='password'>Location</p>
                    <input className='ip-login' type='text' onChange={(e)=>inputChange4(e)} placeholder='City,Country'></input>
                </form>
                <button className='but-login' onClick={handleSubmit}>Complete Setup</button>
            </div>
        </div>
  )
}

export default Info