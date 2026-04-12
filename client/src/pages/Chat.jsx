import React from 'react'
import './Css/Chat.css'
import Addcontact from '../components/Addcontact';
import Profile from '../components/Profile';
import Otherwise from '../components/Otherwise';
import Contacts from '../components/Contacts';
import Viewchat from '../components/Viewchat';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket,faEllipsisVertical ,faPersonCirclePlus,faMagnifyingGlass,faUser,faFaceFrown} from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { useState,useEffect } from 'react';
import axios from 'axios';
import AddGroup from '../components/AddGroup';
const Chat = () => {
  const [user,setUser]=useState({});
  const [view,setView]=useState("otherwise");
  const [selectedChat,setSelectedChat]=useState(null);
  const [contact,setContact]=useState([]);
  const [present,setPresent]=useState(false);
  const [search,setSearch]=useState('');
  const [option,setOption]=useState(false);
  const renderView=()=>{
    switch(view){
      // case 'chat': return <Chat chat={selectedChat}/>;
      case 'profile': return <Profile setView={setView}/>;
      case 'addcontact': return <Addcontact setView={setView}/>;
      case 'addgroup':return <AddGroup/>;
      case 'otherwise':return <Otherwise setView={setView}/>;
      case 'contacts':return <Contacts setView={setView} setSelectedChat={setSelectedChat} selectedChat={selectedChat}/>
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
                console.log(response.data)
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
  const handleChange=(e)=>{
      setSearch(e.target.value);
  }
  const gotoContacts=()=>{
    setView("contacts");
    setOption(false);
  }
  const gotoaddContact=()=>{
    setView("addcontact");
    setOption(false);
  }
  const gotoStatus=()=>{
    setView("addgroup");
    setOption(false);
  }
  return (
    <div className='chat-container'>
      <div className="chat-left">
          <div className="search-members">
              <div className="chat-nav">
                  <img src={user.profile_pic} onClick={()=>setView("profile")} title='Profile' alt='profile-pic' className='chat-profile'></img>
                <div className='select-chat'>
                    <button className='select-chat-button' onClick={()=>setOption(!option)}><FontAwesomeIcon icon={faEllipsisVertical}/></button>
                      {option &&(
                          <div className="options">
                            <button title='Contacts' onClick={()=>gotoContacts()} className='addcontacts'><FontAwesomeIcon className='aicon' icon={faUser} />Contacts</button>
                            <button title='Add contacts' onClick={()=>gotoaddContact()} className='addcontacts'><FontAwesomeIcon className='aicon' icon={faPersonCirclePlus} /> Add Contacts</button>
                            <button title='status' onClick={()=>gotoStatus()} className='status'><FontAwesomeIcon icon={faImage} className='aicon' />Create Group</button>
                            <button title='logout' className='logout' onClick={handleLogout}><FontAwesomeIcon icon={faArrowRightFromBracket} className='aicon'/>Logout</button>
                          </div>
                          )}
                      </div>
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
            contact.length > 0 ?(
            contact.map((user11)=>(
              user11.type==='private' ?(
              <div key={user11.user.id} className="chat-item" onClick={()=>addchat(user11)}>
                  <img src={user11.user.profile_pic} className='chat2-profile'  alt='profile-image'></img>
                  <div className="name-email-contact">
                  <p style={{fontSize:'1.3rem',fontWeight:'550'}}>{user11.user.name}</p>
                  <p style={{color:'rgb(77, 75, 75)'}}>{user11.user.bio}</p>
                  </div>
              </div>
              ):(
                <div key={user11.user.id} className="chat-item" onClick={()=>addchat(user11)}>
                  <img src={user11.user.group_pic} className='chat2-profile'  alt='profile-image'></img>
                  <div className="name-email-contact">
                  <p style={{fontSize:'1.3rem',fontWeight:'550'}}>{user11.user.name}</p>
                  <p style={{color:'rgb(77, 75, 75)'}}>{user11.type}</p>
                  </div>
                </div>
              )
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