const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const {userModel} = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory} = require("../services/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  // socket middleware
  io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    console.log("Socket Connection Cookies:", cookies);

    if (!cookies.token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
  socket.on("ai-message", async (messagepayload) => {
    

    try {
      
      

      // await messageModel.create({
      //   chat: messagepayload.chat,
      //   role: "user", 
      //   content: messagepayload.content,
      //   user: socket.userId
      // });
      

      const vectors = await aiService.generateVector(messagepayload.contents);
      console.log("Generated Vectors:", vectors);



      // 3. Chat history nikalo
      const chatHistory = (
        await messageModel.find({ chat: messagepayload.chat })
          .sort({ createdAt: 1 })
          .limit(20)
          .lean()
      ).reverse();

      // 4. AI response banao
      const response = await aiService.generateResponse(chatHistory.map(item=>{
        return { 
          role: item.role, 
          parts: [{text:item.content} ]
        }
      })
      );
      
      // await messageModel.create({
      //   chat: messagepayload.chat,
      //   role: "model", 
      //   content: response,
      //   user: socket.userId
      // });




      // 5. Client ko bhejo
      
      
      socket.emit("ai-response", {
        message: response,
        contents: messagepayload.contents
      });

      console.log("Sent ai-response:", response);
    } catch (err) {
      console.error("🔥 Error in ai-message handler:", err.message);
      socket.emit("ai-error", { error: err.message });
    }
  });
});
  return io;
}

module.exports = { initSocketServer };