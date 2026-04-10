import React from 'react'
import './Css/Addgroup.css'
import profileImg from '../assets/Profile.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft,faMagnifyingGlass,faPersonCirclePlus,faFaceFrown,faUserPlus,faCheck,faPeopleGroup,faXmark,faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import Line from './line'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {supabase} from './lib.js';
const AddGroup = ({setView}) => {
    const navigate=useNavigate('');
    const [contact,setContact]=useState([]);
    const[find,setFind]=useState('');
    const [show,setShow]=useState(false);
    const[search,setSearch]=useState(true);
    const[notfound,setNotfound]=useState(false);
    const[found,setFound]=useState(false);
    let [addedUsers, setAddedUsers] = useState([]);
    const [groupname,setGroupname]=useState('');
    const [yesornoadded,setYesornoAdded]=useState(false);
    const [message,setMessage]=useState('');
    const [messagepresent,setMessagepresent]=useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [startAddimage,setstartAddimage]=useState(false);
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
            const res=await axios.get(`http://localhost:8860/add-contact?query=${value}`,{headers:{Authorization:`Bearer ${token}`}})
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
        setAddedUsers(prev => [...prev, user]);
        setYesornoAdded(true);
    }
    const resetUsers=()=>{
        setAddedUsers([]);
        setYesornoAdded(false);
    }
    const addUsers=async()=>{
        setstartAddimage(true);
        // try{
        //     const token=localStorage.getItem('token');
        //     if(groupname===''){
        //         setMessage('Please Provide a Groupname');
        //         setMessagepresent(true);
        //         return ;
        //     }
        //     else if(yesornoadded===false){
        //         setMessage('Please add contacts');
        //         setMessagepresent(true);
        //         return ;
        //     }
        //     const res=await axios.post('http://localhost:8860/addgroup',{addedUsers,groupname},{headers:{Authorization:`Bearer ${token}`}});
        //     setMessage(res.data.message);
        //     setMessagepresent(true);
            
        // }catch(err){
        //     console.log(err);
        // }
    }
    const addGroup=async()=>{
        try{
            const token=localStorage.getItem('token');
            let send_image=null;
            if(groupname===''){
                setMessage('Please Provide a Groupname');
                setMessagepresent(true);
                return ;
            }
            else if(yesornoadded===false){
                setMessage('Please add contacts');
                setMessagepresent(true);
                return ;
            }
            else if(image=='null'){
                setstartAddimage(false);
                setMessage('Please add contacts');
                setMessagepresent(true);
                return ;
            }
            if(image){
                const filePath = `chat/${Date.now()}_${image.name}`;
                const { data, error}= await supabase.storage
                .from('images')
                .upload(filePath,image);

                if(error){
                    console.log(error);
                    return ;
                }
                const {data:publicUrl}=await supabase.storage
                .from('images')
                .getPublicUrl(filePath);

                send_image=publicUrl.publicUrl;
                }
            console.log('image',send_image);
            const res=await axios.post('http://localhost:8860/addgroup',{addedUsers,groupname,send_image},{headers:{Authorization:`Bearer ${token}`}});
            setMessage(res.data.message);
            setMessagepresent(true);
            setstartAddimage(false);
            setImage(null);
            setPreview(null);
            window.location.reload;   
        }catch(err){
            console.log(err);
        }
    }
    const removeUser=(user11)=>{
        setAddedUsers(prev => prev.filter(user => user.id !== user11.id));
         if (addedUsers.length <= 1) {
            setYesornoAdded(false);
        }
         console.log('added users',addedUsers);
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage('');
            setMessagepresent(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [message]); 

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };
    console.log('added users',addedUsers);
    console.log(contact);
  return (
    <div className="Addcontact-container">
        <div className="addcontact">
           <p className='back-icon' onClick={gotoChat}> <FontAwesomeIcon icon={faArrowLeft}  /></p>
           <div className="Add">
            <p style={{fontSize:'1.4rem',fontWeight:'550'}}>Add Contact to Create Group</p>
            <p style={{fontSize:'0.8rem'}}> Search by email or user name</p>
           </div>
        </div>
        <div className="addcontact-search">
            <form className='form-search-addcontact'   onSubmit={(e) => e.preventDefault()}>
              <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "rgb(60, 60, 60)"}} />
              <input type='text' onChange={(e)=>handleChange(e)} className='text-search-addcontact' placeholder='Search Contacts'></input>
            </form>           
        </div>
        <div className="give-name-addgroup">
            <form className='form-search-addcontact'   onSubmit={(e) => e.preventDefault()}>
              <FontAwesomeIcon icon={faPeopleGroup} style={{color: "rgb(60, 60, 60)"}} />
              <input type='text' value={groupname} onChange={(e)=>setGroupname(e.target.value)} className='text-search-addcontact' placeholder='Enter Group Name'></input>
            </form>     
            <button className='button-addgroup' onClick={resetUsers}>Reset Users</button>
            <button className='button-addgroup' onClick={addUsers}>Add</button>
        </div>
        <Line></Line>
        {startAddimage && <div className='add_image'>
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
            </form>
            <button className='remove-user-addgroup' onClick={addGroup}>Submit</button>
        </div> }
        {messagepresent ?(    <div className="message-box"><p><FontAwesomeIcon icon={faPersonCirclePlus} style={{color: "rgb(60, 60, 60)"}} /></p><p>{message}</p></div>):(
        <div className="show-contact-addgroup">
            {search && <div className='show-contact-search'><p><FontAwesomeIcon icon={faPersonCirclePlus} style={{color: "rgb(60, 60, 60)"}} /></p><p style={{color: "rgb(60, 60, 60)"}} >Add Contacts</p></div>}
            {notfound && <div className='show-contact-search'><p><FontAwesomeIcon icon={faFaceFrown} style={{color: "rgb(60, 60, 60)"}} /></p><p style={{color: "rgb(60, 60, 60)"}} >Not Found</p></div>}
            {found &&
                <div className="contact-list-addgroup">
                    {contact.map((user)=>(
                        <div key={user.id} className="contact-item">
                            <img src={user.profile_pic} className='chat-profile'  alt='profile-image'></img>
                            <div className="name-email-contact">
                                <p style={{fontSize:'1.3rem',fontWeight:'550'}}>{user.name}</p>
                                <p style={{color:'rgb(77, 75, 75)'}}>{user.email}</p>
                            </div>
                            {addedUsers.some(added => added.id === user.id)  ?<p className='add-contact-icon'><FontAwesomeIcon icon={faCheck} className='contact-icon' style={{fontSize:'2rem'}} /></p>
                            :<p className='add-contact-icon'><FontAwesomeIcon icon={faUserPlus} onClick={()=>handleAdd(user)} className='contact-icon' style={{fontSize:'2rem'}} /></p>}
                        </div>
                    ))}
                </div>
            }
            <div className="show-added">
                {yesornoadded ?
                (<div className='addedusers'>
                    {addedUsers.map((user)=>(
                        <div key={user.id} className="contact-item-addgroup">
                            <img src={user.profile_pic} className='chat-profile'  alt='profile-image'></img>
                            <div className="name-remove-addgroup">
                                <p style={{fontSize:'1.3rem',fontWeight:'550'}}>{user.name}</p>
                                <button className='remove-user-addgroup' onClick={()=>removeUser(user)}><FontAwesomeIcon icon={faXmark} style={{color: "rgb(60, 60, 60)"}} /></button>
                            </div>
                        </div>
                    ))}
                </div>):
                (<div className='addedusers-addgroup'><p><FontAwesomeIcon icon={faPersonCirclePlus} style={{color: "rgb(60, 60, 60)"}} /></p><p>Added Users</p></div>)    
                }
            </div>
        </div>
        )}
    </div>
  )
}

export default AddGroup