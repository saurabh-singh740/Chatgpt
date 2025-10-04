require('dotenv').config();
const app=require("./src/app");
const connectDB=require("./src/DB/db");
const initSocketServer = require("./src/sockets/socket.server");

const http=require('http');
const httpServer=http.createServer(app);

// Initialize Socket.io server


connectDB();
initSocketServer(httpServer);


httpServer.listen(3000,()=>{
    console.log("Server is running on port 3000");
})