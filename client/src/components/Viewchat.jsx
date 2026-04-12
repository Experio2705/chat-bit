import React from 'react'
import { useState ,useEffect, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faPaperPlane,faEllipsisVertical,faXmark} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Css/Viewchat.css';
import socket from './socket.js';
import { text } from '@fortawesome/fontawesome-svg-core';
import {supabase} from './lib.js';
const Viewchat = ({setView,selectedChat}) => {
      const [convo_id,setConvo_id]=useState(null);
      const [message,setMessage]=useState([]);
      const [userId,setUserId]=useState();
      const [sendmessage,setSendmessage]=useState('');
      const [image, setImage] = useState(null);
      const [preview,setPreview]=useState(null);
      const [option,setOption]=useState(false);
      const [profile,setProfile]=useState(false);
      const [profileInfo,setProfileInfo]=useState(null);
      const [fastImage,setFastImage]=useState(false);
      const [type,setType]=useState(null);
      const [user,setUser]=useState(null);
      const inputRef = useRef(null);
    const handleChange=async()=>{
        if (sendmessage.trim() === "" && !image) return;
        let messageData = {};
        try{
            const token=localStorage.getItem('token');
            let type=text;
            let content=sendmessage;
            if(sendmessage.trim() !== "" && !image){
                type='text'
                content=sendmessage;
            }
            if(image){
                type='image';
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

                content=publicUrl.publicUrl;
            }
            messageData = {
                convo_id: selectedChat.id,
                content,
                sender_id: userId,
                receiver_id: selectedChat.contact_user_id,
                  sender: {
                    id: userId,
                    name: user?.name,          
                    },
                type
            };
            if(type==='image'){
                setFastImage(true);
            }
            await axios.post('https://chat-bit-xl7u.onrender.com/message_send',{convo_id:selectedChat.id,content,type:type},{headers:{Authorization:`Bearer ${token}`}});
        }catch(err){
            console.log(err);
        }
        socket.emit('message',messageData);
            if (inputRef.current) {
                inputRef.current.textContent = "";
                }
        setSendmessage('');
        setImage(null);
        setPreview(null);
    }

    const handleInput=(e)=>{
        const value = e.currentTarget.textContent;
        setSendmessage(value);
        console.log(value);
    }

    useEffect(()=>{
        socket.connect();
    },[]);

    useEffect(()=>{
        if (!selectedChat?.id) return;
        setConvo_id(selectedChat.id);
        socket.emit('convo_id',selectedChat.id);
        const getMessages=async()=>{
            try{
                const token=localStorage.getItem('token')
                const res=await axios.get(`https://chat-bit-xl7u.onrender.com/getMessages?query=${selectedChat.id}`,{headers:{Authorization:`Bearer ${token}`}});
                const response = await axios.get('https://chat-bit-xl7u.onrender.com/get-profile',{ headers: { Authorization: `Bearer ${token}` } });
                const reversedData = res.data.data.toReversed();
                setMessage(reversedData);
                setUserId(res.data.user_id)
                setUser(response.data);
            }
            catch(err){
                console.log(err);
            }
        }
        const handleMessage=(data)=>{
            console.log('message recieved');
            if(data.convo_id===selectedChat.id){
                setMessage((prev)=>[data, ...prev])
            }
        }
        socket.on('message-send',handleMessage)
        getMessages();
        return () => {
            socket.off('message-send', handleMessage);
            socket.emit('leave',selectedChat.id);
        };
      },[selectedChat]);
    const handleKeydown=(e)=>{
        if(e.key==='Enter' && !e.shiftKey){
            e.preventDefault;
            handleChange();
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const handleCancel=()=>{
        setImage(null);
        setPreview(null);
    }

    const deleteChat=async()=>{
        try{
            const token=localStorage.getItem('token');
            await axios.get(`https://chat-bit-xl7u.onrender.com/deleteChat?query=${selectedChat.id}`,{headers:{Authorization:`Bearer ${token}`}});
            window.location.reload();
        }catch(err){
            console.log(err);
        }
    }

    const showProfile=async()=>{
        setProfile(!profile);
        if(!profile){
            try{
                const token=localStorage.getItem('token');
                const res1=await axios.get(`https://chat-bit-xl7u.onrender.com/showprofile?query1=${selectedChat.user.id}&query2=${selectedChat.type}`,{headers:{Authorization:`Bearer ${token}`}});
                setProfileInfo(res1.data.data);
                setProfile(true);
                setType(res1.data.type);
            }catch(err){console.log(err);}
        }
    }
    const closeProfile=()=>{
        setProfile(false);
        setOption(false);
        setProfileInfo(null);
        setType(null);
    }
  return (
    <div className="Addcontact-container">
        <div className="addcontact">
            {
                selectedChat.type==='private'?(
                    <div key={selectedChat.id} className="viewchat-item" >
                        <img src={selectedChat.user.profile_pic} className='chat2-profile'  alt='profile-image'></img>
                        <div className="name-email-contact">
                            <p style={{fontSize:'1.3rem',fontWeight:'550'}}>{selectedChat.user.name}</p>
                            <p style={{color:'rgb(77, 75, 75)'}}>{selectedChat.user.email}</p>
                        </div>
                    </div>
                ):(
                    <div key={selectedChat.id} className="viewchat-item" >
                        <img src={selectedChat.user.group_pic} className='chat2-profile'  alt='profile-image'></img>
                        <div className="name-email-contact">
                            <p style={{fontSize:'1.3rem',fontWeight:'550'}}>{selectedChat.user.name}</p>
                        </div>
                    </div>                   
                )
            }
      
                <div className='select-viewchat'>
                    <button className='select-viewchat-button' onClick={()=>setOption(!option)}><FontAwesomeIcon icon={faEllipsisVertical}/></button>
                    {option &&(
                    <div className="options">
                        <div onClick={()=>showProfile()}>Info</div>
                        <div onClick={()=>deleteChat()}>Delete Chat</div>
                    </div>
                )}
                </div>
        </div>  
        <div className="chats">
            <div className="chat-container-viewchat">
                {
                    message.map((m)=>{
                        const checkmessage=m.sender_id==userId;
                        return (
                            <div key={m.id} className={`message-row ${checkmessage ? 'row-right' : 'row-left'}`}> 
                                <div className={`message-bubble ${checkmessage ? 'bubble-user' : 'bubble-other'}`}>
                                    <p className='sender-name'>{m.sender?.name || "User"}</p>
                                    {m.message_type==='image' ?
                                    (<img src={m.content} alt="sent content" className="message-image"></img>):
                                        fastImage ? (<img src={m.content} alt="sent content" className="message-image"></img>):((m.content))
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                {
                   profile && profileInfo && (
                    <div className="profile-outer">
                    {type==='private'?(
                        <div className="information">
                            <div className="cross-viewChat" onClick={()=>closeProfile()}><FontAwesomeIcon icon={faXmark} style={{color: "rgb(99, 230, 190)",}} /></div>
                            <div className="profile_pic"><img src={profileInfo.profile_pic} alt='profile_pic' className='profile'></img>
                            {profileInfo.email}
                            </div>
                            <p style={{fontSize:'1rem' ,color:'grey'}}>Name </p>
                            <p style={{fontSize:'1.5rem',marginBottom:'3%'}}>{profileInfo.name}</p>
                            <p style={{fontSize:'1rem' ,color:'grey'}}>Bio </p>
                            <p style={{fontSize:'1.5rem'}}>{profileInfo.bio}</p>
                        </div>
                    ):(
                        <div className="information">
                            <div className="cross-viewChat" onClick={()=>closeProfile()}><FontAwesomeIcon icon={faXmark} style={{color: "rgb(99, 230, 190)",}} /></div>
                            <div className="profile_pic"><img src={profileInfo.group_pic} alt='profile_pic' className='profile'></img>
                            </div>
                            <p style={{fontSize:'1rem' ,color:'grey'}}>Name </p>
                            <p style={{fontSize:'1.5rem',marginBottom:'3%'}}>{profileInfo.name}</p>

                        </div>
                        )}
                    </div>
                   ) 
                }
            </div>
            <div className="send-chat-viewchat">
                <input id="file-input"  type="file"  onChange={handleImageChange} accept="image/*"  hidden/>
                <label htmlFor="file-input" className="add-file-btn" style={{ cursor: 'pointer', fontSize: '24px', marginRight: '10px' }}>+</label>
                {preview ? (
                    <div className="image-shown">
                        <img src={preview} alt="preview" className="preview-img-viewchat" />
                        <div className="cross" onClick={handleCancel}>X</div>
                    </div>
                        ) : (
                            <div ref={inputRef} contentEditable="true" onKeyDown={handleKeydown} onInput={(e)=>handleInput(e)} role="textbox" spellCheck="true" title="Type a message" className='text-box-viewchat' aria-placeholder='Type a message'></div>
                    )}
                <p className='send-chat' onClick={handleChange}><FontAwesomeIcon icon={faPaperPlane} style={{color: "rgb(99, 230, 190)",fontSize:'2rem'}} /></p>
            </div>
        </div>
      </div>
  )
}

export default Viewchat