import {io} from 'socket.io-client'

const socket=io("https://chat-bit-xl7u.onrender.com",{
    autoConnect:false,
})

export default socket;