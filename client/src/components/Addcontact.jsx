import React from 'react'
import './Css/Addcontact.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft,faMagnifyingGlass,faPersonCirclePlus,faFaceFrown,faUserPlus,faCheck } from '@fortawesome/free-solid-svg-icons'
import Line from './Line.jsx'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Addcontact = ({setView}) => {
    const navigate=useNavigate('');
    const [contact,setContact]=useState([]);
    const[find,setFind]=useState('');
    const [show,setShow]=useState(false);
    const[search,setSearch]=useState(true);
    const[notfound,setNotfound]=useState(false);
    const[found,setFound]=useState(false);
    const [addedUsers, setAddedUsers] = useState([]);
    const [exists,setExists]=useState([]);
    const handleChange=async(e)=>{
        const value=e.target.value;
        setFind(value);
        if (!value) {
            setSearch(true);
            setNotfound(false);
            setFound(false);
            setContact([]);
            return;
            }
        const token=localStorage.getItem('token');
        try{
            const res=await axios.get(`https://chat-bit-xl7u.onrender.com/add-contact?query=${value}`,{headers:{Authorization:`Bearer ${token}`}})
            setContact(res.data);
            console.log(res.data);
            if (res.data.length === 0) {
                setNotfound(true);
                setFound(false);
            } else {
                setFound(true);
                setNotfound(false);
                }
                setSearch(false);
        }
        catch(err){
            console.log(err);
        }
    }
    const gotoChat=()=>{
        setView('otherwise');
    }
    const handleAdd=async(user)=>{
        try{
            const contact_user_id=user.id;
            // const add_contact_name=user.name;
            // const add_contact_email=user.email;
            // const add_contact_profilepic=user.profile_pic;
            const token=localStorage.getItem('token');
            // const res=await axios.post('http://localhost:8860/addcontact',{add_contact_id,add_contact_name,add_contact_email,add_contact_profilepic},{headers:{Authorization:`Bearer ${token}`}});
            const res=await axios.post('https://chat-bit-xl7u.onrender.com/conversation',{contact_user_id},{headers:{Authorization:`Bearer ${token}`}});
            if(res.data.message==='Contactadded'){
                setAddedUsers(prev => [...prev, user.id]);
                window.location.reload() 
            }
            else if(res.data.message==='Conversation Exists'){
                setExists(prev => [...prev, user.id]);
            }
        }
        catch(err){
            console.log(err);
        }
    }
  return (
    <div className="Addcontact-container">
        <div className="addcontact">
           <p className='back-icon' onClick={gotoChat}> <FontAwesomeIcon icon={faArrowLeft}  /></p>
           <div className="Add">
            <p style={{fontSize:'1.4rem',fontWeight:'550'}}>Add Contact</p>
            <p style={{fontSize:'0.8rem'}}> Search by email or user name</p>
           </div>
        </div>
        <div className="addcontact-search">
            <form className='form-search-addcontact'   onSubmit={(e) => e.preventDefault()}>
              <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "rgb(60, 60, 60)"}} />
              <input type='text' onChange={(e)=>handleChange(e)} className='text-search-addcontact' placeholder='Search Contacts'></input>
              </form>           
        </div>
        <Line></Line>
        <div className="show-contact">
            {search && <div className='show-contact-search'><p><FontAwesomeIcon icon={faPersonCirclePlus} style={{color: "rgb(60, 60, 60)"}} /></p><p style={{color: "rgb(60, 60, 60)"}} >Add new Contact</p></div>}
            {notfound && <div className='show-contact-search'><p><FontAwesomeIcon icon={faFaceFrown} style={{color: "rgb(60, 60, 60)"}} /></p><p style={{color: "rgb(60, 60, 60)"}} >Not Found</p></div>}
            {found &&
                <div className="contact-list">
                    {contact.map((user)=>(
                        exists.includes(user.id)?(<div className='show-contact-search' style={{height:'180px'}}><p><FontAwesomeIcon icon={faFaceFrown} style={{color: "rgb(60, 60, 60)"}} /></p><p style={{color: "rgb(60, 60, 60)"}} >Contact Already Exists</p></div>):(
                        <div key={user.id} className="contact-item">
                            <img src={user.profile_pic} className='chat-profile'  alt='profile-image'></img>
                            <div className="name-email-contact">
                                <p style={{fontSize:'1.3rem',fontWeight:'550'}}>{user.name}</p>
                                <p style={{color:'rgb(77, 75, 75)'}}>{user.email}</p>
                            </div>
                            {addedUsers.includes(user.id) ?<p className='add-contact-icon'><FontAwesomeIcon icon={faCheck} className='contact-icon' style={{fontSize:'2rem'}} /></p>
                            :<p className='add-contact-icon'><FontAwesomeIcon icon={faUserPlus} onClick={()=>handleAdd(user)} className='contact-icon' style={{fontSize:'2rem'}} /></p>}
                        </div>
                        )
                    ))}
                </div>

            }
        </div>
    </div>
  )
}

export default Addcontact