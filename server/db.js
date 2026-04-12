import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js/dist/index.cjs';
import dotenv from 'dotenv';
import { jwtAuthMiddleware,generateToken } from './jwt.js';
import { error, profile } from 'node:console';
import bcrypt from 'bcrypt'
import multer from 'multer';
import { json } from 'node:stream/consumers';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

dotenv.config();
const app=express();
app.use(cors({
  origin: "https://chat-bit-orcin.vercel.app",
  credentials: true
}));
app.use(express.json());
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const upload = multer({
  storage: multer.memoryStorage()
});

///socket

const server=createServer(app);
const io=new Server((server),{
    cors:{
        origin:"*",
    }
})
io.on("connection",(socket)=>{
    socket.on('convo_id',(conversation_id)=>{
        socket.join(conversation_id);
    })
    socket.on('message',(msg)=>{
        io.to(msg.convo_id).emit('message-send',msg);
    })
    socket.on('leave',(conversation_id)=>{
        socket.leave(conversation_id);
    })
})


///socket
app.get('/', (req, res) => {
    res.send('Server is working 🚀');
});
app.post('/Register',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const hashpassword=await bcrypt.hash(password,10);
        const {data,error}=await supabase
        .from('users')
        .insert([{email,password_hash:hashpassword}])
        .select();
        if(error){
            return res.status(400).json({error});
        }
        res.json({message:'User Register'});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
    console.log('Req received');
});
app.post('/otp-store',async(req,res)=>{
    try{
        const {email,otp}=req.body;
        const otp_expiry=Date.now()+2*60*1000;

        const{data,error}= await supabase
        .from('users')
        .update({otp,otp_expiry})
        .eq('email',email)
        .select();
        if(error){
            console.log(error);
        }
        res.json({ message: "OTP stored" });
    }
    catch(err){
        console.log(err);
    }
})
app.post('/Authenticate',async (req,res)=>{
    try{
        const {email,otp}=req.body;
        const {data:user,error}=await supabase
        .from('users')
        .select('*')
        .eq('email',email)
        .single();
        if(Date.now() > user.otp_expiry ){
            return res.json({message:'Otp Expired'})
        }
        if(Number(otp)!==user.otp){
            return res.json({message:'Invalid Otp'})
        }
    if(error){
        return res.status(400).json({error});
        }
    
        const token =generateToken(
            {id:user.id}
        );
        await supabase
            .from('users')
            .update({ otp: null, otp_expiry: null })
            .eq('id', user.id);

        res.json({
            message: "Verified",
            token,
            user
        });

    }
    catch(err){
         res.status(500).json({ error: err.message });
    }
});
app.post('/Info',jwtAuthMiddleware,upload.single('image'),async(req,res)=>{
    try{
        console.log("➡️ Request hit /Info");  
        const userId=req.user.id;
        const {dname,bio,pnumber,location}=req.body;
        let imageUrl=null;
        console.log('Request file:',req.file)
        if(req.file){
            const ext = req.file.originalname.split('.').pop();
            const filename = `${userId}-${Date.now()}.${ext}`;
            const{data:uploadData,error:uploadError}=await supabase.storage
            .from('profiles')
            .upload(filename,req.file.buffer,{
                contentType:req.file.mimetype
            });
            if(uploadError){
                console.log(uploadError);
                return res.status(400).json({ error: uploadError });
            }
            console.log("✅ Upload success");
            const {data:urlData}=supabase.storage
            .from('profiles')
            .getPublicUrl(filename);
            imageUrl=urlData.publicUrl;
    }
        const{data,error}=await supabase
        .from('users')
        .update({profile_pic:imageUrl,name:dname,bio,phone:pnumber,status:'online',location})
        .eq('id',userId)
        .select();
        if(error){
            console.log(error);
            return res.status(400).json({error});
        }
        res.json({message:'User Register'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err.message});
    }

});

app.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const {data:user,error}=await supabase
        .from('users')
        .select('*')
        .eq('email',email)
        .single();
        if(!user || error){
            return res.json({message:'invaliduser'});
        }
        const isMatch=await bcrypt.compare(password,user.password_hash);
        if(!isMatch){
            return res.json({message:'invalidpass'});
        }
        const token=generateToken({id:user.id});
        res.json({
            token,
            message:'verified',
            user
        });
    }
    catch(err){
        console.log(err);
    }
})
app.post('/reset',async(req,res)=>{
    try{
        const {email}=req.body;
        const {data:user,error}=await supabase
        .from('users')
        .select('*')
        .eq('email',email)
        .single();
        if(!user){
            return res.json({message:'notfound'})
        }
        res.json({message:'found'});
    }
    catch(err){
        console.log(err);
    }
})
app.post('/reset-pass',async(req,res)=>{
    try{
        const {rpassword}=req.body;
        const resetpassword=await bcrypt.hash(rpassword,10);
        const {data:user,error}=await supabase
        .from('users')
        .update([{password_hash:resetpassword}])
        .eq('email',email)
        .select();
        if(error){
            console.log(error);
        }
        res.json({message:'updated'});
    }
    catch(err){
        console.log(err);
    }
})

//chatt
app.get('/user',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userId=req.user.id;

        const{data:userData,error}=await supabase
        .from('users')
        .select('*')
        .eq('id',userId)
        .single();
        if(error){
            console.log(error);
        }
        res.json(userData);
    }
    catch(err){
        console.log(err);
    }
})
//add-contact
app.get('/add-contact',jwtAuthMiddleware,async(req,res)=>{
    try{
        const {query}=req.query;
        if (!query || query.length < 2) {
        return res.json([]);
        }
        const cleanQuery = query.replace(/[^a-zA-Z0-9@.]/g, '');
        const {data:contactData,error}=await supabase
        .from('users')
        .select('*')
        .or(`email.ilike.%${cleanQuery}%,name.ilike.%${cleanQuery}%`);

        const filtered = contactData.filter(
            user => user.id !== req.user.id
        );
        if(error){
            console.log(error);
            return res.status(500).json({ error: "Database error" });

        }
        if(contactData.id===req.user.id || !contactData){
            return res.json();
        }
        res.json(filtered);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ error: "Server error" });

    }
})

app.post('/addcontact',(jwtAuthMiddleware),async(req,res)=>{
    // try{
    //     const {add_contact_id,add_contact_name,add_contact_email,add_contact_profilepic}=req.body;
    //     const userId=req.user.id;
    //     const {data,error}=await supabase
    //     .from('contacts')
    //     .insert([{user_id:userId,contact_user_id:add_contact_id,name:add_contact_name,email:add_contact_email,profile_pic:add_contact_profilepic}])
    //     .select();
    //     if(error){
    //          console.log(error);
    //         return res.status(500).json({error:"Database Error"});
    //     }
    //     res.json({message:'Contactadded'});
    // }
    // catch(err){
    //     return res.status(500).json({error:"Server Error"});
    // }
    try {

    const userId = req.user.id;
    const { contact_user_id } = req.body;

    // ✅ get all conversations of user
    const { data: userConvo, error } = await supabase
      .from('conversation_members')
      .select('conversation_id')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: "Database Error" });
    }

    // ✅ check if conversation already exists
    let existingConversation = null;

    if (userConvo && userConvo.length > 0) {
      for (let convo of userConvo) {
        const { data } = await supabase
          .from('conversation_members')
          .select('*')
          .eq('conversation_id', convo.conversation_id)
          .eq('user_id', contact_user_id);

        if (data.length > 0) {
          existingConversation = convo.conversation_id;
          break;
        }
      }
    }

    if (existingConversation) {
      return res.json({
        message: 'Conversation Exists',
        conversationId: existingConversation
      });
    }

    const { data: newConvo, error: convoError } = await supabase
      .from('conversations')
      .insert([{ type: 'private', created_by: userId }])
      .select()
      .single();

    if (convoError) {
      return res.status(500).json({ error: "Conversation creation failed" });
    }

    // ✅ add members
    const { error: memberError } = await supabase
      .from('conversation_members')
      .insert([
        { conversation_id: newConvo.id, user_id: userId },
        { conversation_id: newConvo.id, user_id: contact_user_id }
      ]);

    if (memberError) {
      return res.status(500).json({ error: "Member insert failed" });
    }

    res.json({
      message: 'Conversation Created',
      conversationId: newConvo.id
    });

  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
})

//contacts

app.get('/contacts',jwtAuthMiddleware,async(req,res)=>{
    try{
        console.log('hit contact,',req.user.id);
        const userId=req.user.id;
        console.log(userId);
        const result = [];
        const{data:members,error:error1}=await supabase
        .from('conversation_members')
        .select('*')
        .eq('user_id',userId);

        const convo_id=members.map(m=>m.conversation_id);
        // const member_id=[];
        // await Promise.all(
        //     convo_id.map(async(convo)=>{
        //         const{data:members_users,error}=await supabase
        //         .from('conversation_members')
        //         .select('*')
        //         .eq('conversation_id',convo)
        //         .neq('user_id', userId);

        //         if(members_users){
        //             members_users.forEach(m=>member_id.push(m.user_id));
        //         }
        // }));
        // console.log('members id',member_id);
        const{data:conver,error:error2}=await supabase
        .from('conversations')
        .select('*')
        .in('id',convo_id);
    
        const types=conver.map(m=>({
            type:m.type,
            id:m.id}));
            
        for (const type of types){
            if(type.type=='private'){
                const {data:member_data,error:error4}=await supabase
                .from('conversation_members')
                .select('*')
                .eq('conversation_id',type.id)
                .neq('user_id', userId)
                .single();

                const{data:userData,error:error5}=await supabase
                .from('users')
                .select('*')
                .eq('id',member_data.user_id)
                .single();

                result.push({
                    type: 'private',
                    conversation_id: type.id,
                    user: userData
                })
             }
             else if(type.type=='group'){
                const{data:userData,error:error5}=await supabase
                .from('conversations')
                .select('*')
                .eq('id',type.id)
                .single();

                result.push({
                    type: 'group',
                    conversation_id: type.id,
                    user: userData
                })
             }
        }
        

        if(error2){
            res.status(500).json({error:'Database Error'})
        }

        if(error1){
            res.status(500).json({error:'Database Error'})
        }
        res.json(result);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Database Error'})
    }
})
app.post('/conversation', jwtAuthMiddleware, async (req, res) => {
  try {

    const userId = req.user.id;
    const { contact_user_id } = req.body;

    // ✅ get all conversations of user
    const { data: userConvo, error } = await supabase
      .from('conversation_members')
      .select('conversation_id')
      .eq('user_id', userId);

    console.log(userConvo)

    if (error) {
        console.log(error);
      return res.status(500).json({ error: "Database Error" });
    }

    // ✅ check if conversation already exists
    let existingConversation = null;

    if (userConvo && userConvo.length > 0) {
      for (let convo of userConvo) {
        const { data } = await supabase
        .from('conversation_members')
        .select(`conversation_id,conversations!inner(type)`)
        .eq('conversation_id', convo.conversation_id)
        .eq('user_id', contact_user_id)
        .eq('conversations.type', 'private');

        if (data.length > 0) {
          existingConversation = convo.conversation_id;
          break;
        }
      }
    }
    console.log('existing:',existingConversation);

    // ✅ if exists → return ID
    if (existingConversation) {
      return res.json({
        message: 'Conversation Exists',
        conversationId: existingConversation
      });
    }

    // ✅ create new conversation
    const { data: newConvo, error: convoError } = await supabase
      .from('conversations')
      .insert([{ type: 'private', created_by: userId }])
      .select()
      .single();

    if (convoError) {
      return res.status(500).json({ error: "Conversation creation failed" });
    }

    // ✅ add members
    const { error: memberError } = await supabase
      .from('conversation_members')
      .insert([
        { conversation_id: newConvo.id, user_id: userId },
        { conversation_id: newConvo.id, user_id: contact_user_id }
      ]);

    if (memberError) {
      return res.status(500).json({ error: "Member insert failed" });
    }

    res.json({
      message: 'Contactadded',
      conversationId: newConvo.id
    });

  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/deletcontact',jwtAuthMiddleware,async(req,res)=>{
    try{
        const user_id=req.user.id;
        const {query1,query2}=req.query;
        console.log(query1);
        console.log(query2);
        if (!query1 || query1.length < 2) {
        return res.json([]);
        }
        if(query2==='private'){
            const {data:data1,error:error1}=await supabase
            .from('conversations')
            .delete()
            .eq('id',query1);

            const {data:data2,error:error2}=await supabase
            .from('conversation_members')
            .delete()
            .eq('conversation_id',query1)
        }
        else {
            const{data:userAdmin,error}=await supabase
            .from('conversation_members')
            .select(`role`)
            .eq('conversation_id',query1)
            .eq('user_id',user_id)
            .single();
            if (!userAdmin || userAdmin.role !== 'admin') {
                return res.json({message:'notadmin'})
                }
            else{
                const {data:data1,error:error1}=await supabase
                .from('conversations')
                .delete()
                .eq('id',query1);

            const {data:data2,error:error2}=await supabase
                .from('conversation_members')
                .delete()
                .eq('conversation_id',query1)
            }
            res.json({message:'done'});
            console.log(userAdmin);
        }

        if(error){
            res.status(500).json({message:'Sever Error'});    
        }
    }catch(err){
        res.status(500).json({message:'Sever Error'});
    }
})
//addgroup
app.post('/addgroup',jwtAuthMiddleware,async(req,res)=>{
    try{
        const user_id=req.user.id;
        const {addedUsers,groupname,send_image}=req.body;

        const {data:newConvo,error}=await supabase
        .from('conversations')
        .insert([{created_by:user_id,name:groupname,group_pic:send_image,type:'group'}])
        .select()
        .single()

        for(const user of addedUsers){
            const{data,error}=await supabase
            .from('conversation_members')
            .insert([{conversation_id:newConvo.id,user_id:user.id,role:'member'}]);
        }
        const{data,error2}=await supabase
        .from('conversation_members')
        .insert([{conversation_id:newConvo.id,user_id:user_id,role:'admin'}]); 

        res.json({message:"User Added"})
    }catch(err){
        console.log(err);
    }
})
//viewchat

app.get('/getMessages',jwtAuthMiddleware,async(req,res)=>{
    try{
        const user_id=req.user.id;
        const {query}=req.query;
        const { data, error } = await supabase
        .from('messages')
        .select(`*,
            sender:sender_id (
            id,
            name,
            profile_pic
            )
            `)
        .eq('conversation_id', query);
        if(error){
            res.status(500).json({error:'Database Error'});
        }
        if(data){
            res.json({data,user_id});
        }

    }catch(err){
        res.status(500).json({error:'Server Error'});
    }

})

app.post('/message_send',jwtAuthMiddleware,async(req,res)=>{
    try{
        const { convo_id,content,type}=req.body;
        const sender_id=req.user.id;
        console.log(convo_id,content,sender_id);
            
        
            const {data,error}=await supabase
            .from('messages')
            .insert([{conversation_id:convo_id,sender_id:sender_id,content:content,message_type:type}])
            .select()
            .single();

        if(error){
            console.log(error);
        }
        res.json({message:'data send'});

    }catch(err){
        console.log(err);
    }
})

app.get('/deleteChat',jwtAuthMiddleware,async(req,res)=>{
    try{
        const {query}=req.query;
        const user_id=req.user.id;
        if (!query || query.length < 2) {
            return res.json([]);
        }
        const {data,error}=await supabase
        .from('messages')
        .delete()
        .eq('conversation_id',query);

        if(error){
            res.status(500).json({message:'Database Error'});
            console.log(err);
        }
        res.json({message:'done'});
    } 
    catch(err){
        res.status(500).json({message:'server Error'});
        console.log(err);
    }
})
app.get('/showprofile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const { query1, query2 } = req.query;
        if(query2==='private'){
            const {data,error}=await supabase
            .from('users')
            .select('*')
            .eq('id',query1)
            .single();

            if(error){
                res.status(500).json({message:'Databse Error'});
                console.log(error)
            }
            return res.json({data,type:'private'});
        }
        else{
            const {data,error}=await supabase
            .from('conversations')
            .select('*')
            .eq('id',query1)
            .single();

            if(error){
            res.status(500).json({message:'Databse Error'});
            console.log(error)
            }
            return res.json({data,type:'group'});
        }
        
    }
    catch(err){
        res.status(500).json({message:'Server Error'});
        console.log(err);
    }
})

//profile
app.get('/get-profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const user_id=req.user.id;
        const {data,error}=await supabase
        .from('users')
        .select('*')
        .eq('id',user_id)
        .single();

        if(error){
            res.status(500).json({message:'Database Error'});
        }
        res.json(data);
    }catch(err){
        res.status(500).json({message:'Server Error'});
    }

})

//profile
app.post('/update-info',jwtAuthMiddleware,async(req,res)=>{
    const userId=req.user.id;
    const { name, bio, location, new_image, old_image } = req.body;
    let updateFields = {};
    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;
    if (location) updateFields.location = location;
    if (new_image) updateFields.profile_pic = new_image;

    const { error } = await supabase
    .from("users")
    .update(updateFields)
    .eq("id", userId);

    if (old_image && new_image) {
      const oldPath = old_image.split("/profiles/")[1];

      await supabase.storage
        .from("profiles")
        .remove([oldPath]);
    }
    res.json({message:'Updated Successfully'})
    if (error) {
      return res.status(500).json({ message:'Error' });
    }

})

const PORT=process.env.PORT||8860;

server.listen(PORT,()=>{
    console.log('Server is running at Port :',PORT );
})