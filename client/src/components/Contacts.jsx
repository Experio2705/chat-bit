import React from 'react'
import './Css/Contacts.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft,faMagnifyingGlass,faPersonCirclePlus,faFaceFrown,faUserPlus,faCheck } from '@fortawesome/free-solid-svg-icons'
import Line from './line'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Contacts = ({setView,setSelectedChat}) => {
     const navigate=useNavigate('');
    const [contact,setContact]=useState([]);
    const [present,setPresent]=useState(false);
    const gotoChat=()=>{
        setView('otherwise');
        console.log('clicked')
    }
    useEffect(()=>{
        const getContacts=async()=>{
            const token=localStorage.getItem('token');
           const res= await axios.get('http://localhost:8860/contacts',{headers:{Authorization:`Bearer ${token}`}});
            if(res.data){
                setContact(res.data);
                setPresent(true);
            }
        }
        getContacts();
    },[]);
    const addchat=async(user)=>{
        try{
            const token=localStorage.getItem('token');
            console.log(token);
            const contact_user_id=user.contact_user_id;
            const res=await axios.post('http://localhost:8860/conversation',{contact_user_id},{headers:{Authorization:`Bearer ${token}`}});
            const conversation_id=res.data.convo_id;
            setSelectedChat({
                id: conversation_id,
                user: user 
            });
            setView('viewchat');
        }
        catch(err){
            console.log(err);
        }
    }
    const deleteChat=async(user)=>{
        try{
            const value=user.contact_user_id;
            const token=localStorage.getItem('token');
            await axios.get(`http://localhost:8860/deletcontact?query=${value}`,{headers:{Authorization:`Bearer ${token}`}});
            window.location.reload();
        }catch(err){
            console.log(err);
        }
    }
  return (
    <div className="Contacts-container">
        <div className="addcontact">
           <p className='back-icon' onClick={gotoChat}> <FontAwesomeIcon icon={faArrowLeft}  /></p>
           <div className="Add">
            <p style={{fontSize:'1.4rem',fontWeight:'550'}}>Contacts</p>
            <p style={{fontSize:'0.8rem'}}> Your Added Users</p>
           </div>
        </div>
        <div className="show-contact" style={{height:'120vh'}}>
            {present ? (
                <div className="contact-list">
                    {contact.map((user)=>(
                        <div key={user.id} className="contact-item">
                            <img src={user.profile_pic} className='chat-profile'  alt='profile-image'></img>
                            <div className="name-email-contact">
                                <p style={{fontSize:'1.3rem',fontWeight:'550'}}>{user.name}</p>
                                <p style={{color:'rgb(77, 75, 75)'}}>{user.email}</p>
                            </div>
                            <div className='chat-button-div'><button className='chat-button' onClick={()=>addchat(user)}>Chat</button></div>
                            <div style={{width:'25%'}} className='chat-button-div'><button style={{backgroundColor:'#ff2400'}} className='chat-button' onClick={()=>deleteChat(user)}>Delete</button></div>
                        </div>
                        ))}
                </div>
                ):(
                <div className='show-contact-search'><p><FontAwesomeIcon icon={faFaceFrown} style={{color: "rgb(60, 60, 60)"}} /></p><p style={{color: "rgb(60, 60, 60)"}} >No Contacts Added</p></div>
            )}
        </div>
    </div>
  )
}

export default Contacts