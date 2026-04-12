import React from 'react'
import './Css/Contacts.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft,faMagnifyingGlass,faPersonCirclePlus,faFaceFrown,faUserPlus,faCheck } from '@fortawesome/free-solid-svg-icons'
import Line from './line'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Contacts = ({setView,setSelectedChat,selectedChat}) => {
     const navigate=useNavigate('');
    const [contact,setContact]=useState([]);
    const [present,setPresent]=useState(false);
    const [message,setMessage]=useState(null);
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
    console.log('contact',contact);
    const addchat=async(user)=>{
 try{
            console.log("reached-frontend!");
            console.log('user',user);
            const token=localStorage.getItem('token');
            console.log(token);
            if(user.type==='private'){
              setSelectedChat({
                  id: user.conversation_id,
                  user: user.user, 
                  type:'private'
              });
              // console.log('send selected chat');
            }
            else if(user.type==='group'){
                setSelectedChat({
                  id: user.conversation_id,
                  user: user.user, 
                  type:'group'
              });
            }
            setView('viewchat');
        }
        catch(err){
            console.log(err);
        }
    }
    const deleteChat=async(user)=>{
        try{
            const value=user.conversation_id;
            const token=localStorage.getItem('token');
            const res=await axios.get(`http://localhost:8860/deletcontact?query1=${value}&query2=${user.type}`,{headers:{Authorization:`Bearer ${token}`}});
            if(res.data.message==='notadmin'){
                setMessage('Not an Admin')
            }
            else{
                window.location.reload();
            }
        }catch(err){
            console.log(err);
        }
    }
        useEffect(() => {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1000);
            return () => clearTimeout(timer);
        }, [message]); 
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
            {message && <div className='message-contacts'>Not an Admin</div>}
            {present ? (
                <div className="contact-list">
                    {contact.map((user)=>(
                        user.type==='private' ?(
                            <div key={user.id} className="contact-item">
                                <img src={user.user.profile_pic} className='chat-profile'  alt='profile-image'></img>
                                <div className="name-email-contact">
                                    <p style={{fontSize:'1.3rem',fontWeight:'550'}}>{user.user.name}</p>
                                    <p style={{color:'rgb(77, 75, 75)'}}>{user.user.email}</p>
                                </div>
                                <div className='chat-button-div'><button className='chat-button' onClick={()=>addchat(user)}>Chat</button></div>
                                <div style={{width:'25%'}} className='chat-button-div'><button style={{backgroundColor:'#ff2400'}} className='chat-button' onClick={()=>deleteChat(user)}>Delete</button></div>
                            </div>
                        ):(
                            <div key={user.id} className="contact-item">
                                <img src={user.user.group_pic} className='chat-profile'  alt='profile-image'></img>
                                <div className="name-email-contact">
                                    <p style={{fontSize:'1.3rem',fontWeight:'550'}}>{user.user.name}</p>
                                    <p style={{color:'rgb(77, 75, 75)'}}>{user.type}</p>
                                </div>
                                <div className='chat-button-div'><button className='chat-button' onClick={()=>addchat(user)}>Chat</button></div>
                                <div style={{width:'25%'}} className='chat-button-div'><button style={{backgroundColor:'#ff2400'}} className='chat-button' onClick={()=>deleteChat(user)}>Delete</button></div>
                            </div>
                        )
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