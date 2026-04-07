import React from 'react'
import './Css/Chat.css'
import Addcontact from '../components/Addcontact';
import Profile from '../components/Profile';
import Status from '../components/Status';
import Otherwise from '../components/Otherwise';
import Contacts from '../components/Contacts';
import Viewchat from '../components/Viewchat';
import Information from '../components/Information';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket ,faPersonCirclePlus,faMagnifyingGlass,faUser,faFaceFrown} from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { useState,useEffect } from 'react';
import axios from 'axios';
const Chat = () => {
  const [user,setUser]=useState({});
  const [view,setView]=useState("otherwise");
  const [selectedChat,setSelectedChat]=useState(null);
  const [contact,setContact]=useState([]);
  const [present,setPresent]=useState(false);
  const [search,setSearch]=useState('');
  const renderView=()=>{
    switch(view){
      // case 'chat': return <Chat chat={selectedChat}/>;
      case 'profile': return <Profile user={user} setView={setView}/>;
      case 'addcontact': return <Addcontact setView={setView}/>;
      case 'status':return <Status/>;
      case 'otherwise':return <Otherwise setView={setView}/>;
      case 'contacts':return <Contacts setView={setView} setSelectedChat={setSelectedChat}/>
      case 'viewchat':return <Viewchat setView={setView} selectedChat={selectedChat}/>
      default:
        return <Otherwise user={user} setView={setView}/>
    }
  }
  const navigate=useNavigate();
  const handleLogout=()=>{
    localStorage.clear();
    sessionStorage.clear();
    navigate('/',{replace:true});
  }
  useEffect(()=>{
    const getInfo=async()=>{
      try{
        const token=localStorage.getItem('token');
        if(!token) console.log('no tokken found');
        const res= await axios.get('http://localhost:8860/user',{headers:{Authorization:`Bearer ${token}`}});
        const response= await axios.get('http://localhost:8860/contacts',{headers:{Authorization:`Bearer ${token}`}});
            if(response.data){
                setContact(response.data);
                setPresent(true);
            }
        setUser(res.data);
        console.log(res.data)
      }
      catch(err){
        console.log(err);
      }
    }
    getInfo();
  },[])
  const addchat=async(user)=>{
        try{
            console.log("reached-frontend!");
            const token=localStorage.getItem('token');
            console.log(token);
            const contact_user_id=user.contact_user_id;
            const res=await axios.post('http://localhost:8860/conversation',{contact_user_id},{headers:{Authorization:`Bearer ${token}`}});
            const conversation_id=res.data.conversationId;
            console.log("converstaion_id from chat:",conversation_id);
            setSelectedChat({
                id: conversation_id,
                user: user, 
                contact_user_id :contact_user_id
            });
            setView('viewchat');
        }
        catch(err){
            console.log(err);
        }
    }
  const handleChange=(e)=>{
      setSearch(e.target.value);
  }
  const filteredContacts = contact.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className='chat-container'>
      <div className="chat-left">
          <div className="search-members">
              <div className="chat-nav">
                  <img src={user.profile_pic} onClick={()=>setView("profile")} title='Profile' alt='profile-pic' className='chat-profile'></img>
                  <button title='Contacts' onClick={()=>setView("contacts")} className='addcontacts'><FontAwesomeIcon icon={faUser} style={{color:'rgb(60, 60, 60)'}}/></button>
                  <button title='Add contacts' onClick={()=>setView("addcontact")} className='addcontacts'><FontAwesomeIcon icon={faPersonCirclePlus} style={{color:'rgb(60, 60, 60)'}}/></button>
                  <button title='status' onClick={()=>setView("status")} className='status'><FontAwesomeIcon icon={faImage} style={{color:'rgb(60, 60, 60)'}} /></button>
                  <button title='logout' className='logout' onClick={handleLogout}><FontAwesomeIcon icon={faArrowRightFromBracket} style={{color:'rgb(60, 60, 60)'}}/></button>
                </div>
              <div className="chat-search">
                <form className='form-search'>
                  <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "rgb(60, 60, 60)"}} />
                  <input type='text' onChange={(e)=>handleChange(e)} className='text-search' placeholder='Search Contacts'></input>
                </form>
              </div>
        </div>
        <div className="chat-members" >
          {present? (
            filteredContacts.length > 0 ?(
            filteredContacts.map((user11)=>(
              <div key={user11.id} className="chat-item" onClick={()=>addchat(user11)}>
                  <img src={user11.profile_pic} className='chat2-profile'  alt='profile-image'></img>
                  <div className="name-email-contact">
                  <p style={{fontSize:'1.3rem',fontWeight:'550'}}>{user11.name}</p>
                  <p style={{color:'rgb(77, 75, 75)'}}>{user11.bio}</p>
                  </div>
              </div>
            ))
          ):(
            <div className='show-contact-search'><p><FontAwesomeIcon icon={faFaceFrown} style={{color: "rgb(60, 60, 60)"}} /></p><p style={{color: "rgb(60, 60, 60)"}} >No matching Contact Found</p></div>)
          ):(<div className='show-contact-search'><p><FontAwesomeIcon icon={faFaceFrown} style={{color: "rgb(60, 60, 60)"}} /></p><p style={{color: "rgb(60, 60, 60)"}} >No Contacts Added</p></div>)
          }
        </div>
      </div>
      <div className="chat-right" >
          {renderView()}
      </div>
    </div>
    
  )
}

export default Chat