const express=require('express');
const cookieParser=require('cookie-parser');

//routes
const authRoutes=require('./routes/auth.routes');
const chatRoutes=require('./routes/chat.routes');    


const app=express();
app.use(cookieParser());
app.use(express.json());



app.use('/api/auth',authRoutes);
app.use('/api/chat',chatRoutes);
module.exports=app;