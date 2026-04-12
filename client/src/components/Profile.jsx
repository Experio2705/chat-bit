import React from 'react'
import { useState,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft,faMagnifyingGlass,faPersonCirclePlus,faFaceFrown,faUserPlus,faCheck } from '@fortawesome/free-solid-svg-icons'
import './Css/Profile.css'
import axios from 'axios'
import profileImg from '../assets/Profile.png'
import { data } from 'react-router-dom'
import {supabase} from './lib.js';
const Profile = ({setView}) => {
    const [userData,setuserData]=useState([]);
    const [edit,setEdit]=useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dname,setDname]=useState('');
    const [bio,setBio]=useState('');
    const [location,setLocation]=useState('');
    const gotoChat=()=>{
        setView('otherwise');
    }
    useEffect(()=>{
      const fetchData = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://chat-bit-xl7u.onrender.com/get-profile',{ headers: { Authorization: `Bearer ${token}` } });
        setuserData([res.data]);
        };
        fetchData();
        },[]);
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };
    const changedit=()=>{
      setEdit(!edit);
      setImage(null);
      setPreview(null);
      setDname('');
      setBio('');
      setLocation('');
    }
    const inputChange1=(e)=>{
        setDname(e.target.value);
    }
    const inputChange2=(e)=>{
        setBio(e.target.value);
    }

    const inputChange3=(e)=>{
        setLocation(e.target.value);
    }

    const handlesubmit=async()=>{
      try{
          let send_image=null;
          const payload={};
          if (dname.trim()) payload.name = dname;
          if (bio.trim()) payload.bio = bio;
          if (location.trim()) payload.location = location;
          if(image){
              const filePath = `chat/${Date.now()}_${image.name}`;
              const { data, error}= await supabase.storage
              .from('profiles')
              .upload(filePath,image);

              if(error){
                  console.log(error);
                  return ;
              }
              const {data:publicUrl}=await supabase.storage
              .from('profiles')
              .getPublicUrl(filePath);
              send_image=publicUrl.publicUrl;
              }
          if(send_image) payload.new_image=send_image;
          if(userData) payload.old_image=userData.profile_pic;
          if (Object.keys(payload).length === 0) {
            console.log("Nothing to update");
            return;
            }
        const token =localStorage.getItem('token');
        const res=await axios.post('https://chat-bit-xl7u.onrender.com/update-info',payload,{headers:{Authorization:`Bearer ${token}`}});
        if(res.data.message==='Updated Successfully'){
          window.location.reload();
        }
      }catch(err){
        console.log(err);
      }
    }
  return (
    <div className='profile-outer-1'>
      <div className="addcontact-profile">
           <p className='back-icon' onClick={gotoChat}> <FontAwesomeIcon icon={faArrowLeft}  /></p>
           <div className="Add">
            <p style={{fontSize:'1.4rem',fontWeight:'550'}}>View Details</p>
            <p style={{fontSize:'0.8rem'}}> View and modify user details</p>
           </div>
            <button className='button-profile' onClick={() => changedit()}>Edit</button>
        </div>
      <div className="profile-details">
        {
          userData.map((user)=>(
              <div key={user.id}>
                {user.profile_pic ? (
                  <div>
                  <div className="profile-image-container">
                     <img src={preview || user.profile_pic} className="profile-img" alt="profile"></img>
                    {edit && (
                      <label htmlFor="file-input" className="image-overlay">Change</label>
                    )}
                    <input id="file-input" type="file" accept="image/*" onChange={handleImageChange} hidden/></div>
                    <div className="profile-name"><p className="label" >Name</p><p className="value">{user.name}</p></div>
                    {edit && (
                      <input className='profile-ip' onChange={(e)=>inputChange1(e)} placeholder='Enter you new name'></input>
                    )}
                    <div className="profile-name"><p className="label" onChange={(e)=>inputChange1(e)}>Bio</p><p className="value">{user.bio}</p></div>
                    {edit && (
                      <input className='profile-ip' onChange={(e)=>inputChange2(e)} placeholder='Enter you new bio'></input>
                    )}
                    <div className="profile-name"><p className="label" onChange={(e)=>inputChange3(e)} >Location</p><p className="value">{user.location}</p></div>
                    {edit && (
                      <input className='profile-ip' placeholder='Enter you new location'></input>
                    )}
                    {edit && (
                      <div className="last-div">
                        <button className='button-profile-final' onClick={()=>handlesubmit()}>Submit</button>
                      </div>
                    )}
                    </div>
                  ):(<div className='loader'></div>)
                  }
            </div>
          ))
        }
      </div>
    </div>
  )
}
export default Profile