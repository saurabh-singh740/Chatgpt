const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { text } = require("express");

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
      console.log("Received ai-message:", messagepayload);

      await messageModel.create({
        chat: messagepayload.chatId,
        user: socket.userId,
        contents: messagepayload.contents,   // 👈 changed
        role: "user"
      });

      const chatHistory = (
  await messageModel
    .find({ chat: messagepayload.chatId })
    .sort({ createdAt: 1 })
    .limit(20)
    .lean()
).reverse();


      

      const response = await aiService.generateResponse(chatHistory.map(item=>{
        return {
            role:item.role,
            parts:[{text:item.contents}]
        }
      })); 
      await messageModel.create({
        chat: messagepayload.chatId,
        user: socket.userId,
        contents: response,                  // 👈 changed
        role: "model"
      });

      socket.emit("ai-response", {
        message: response,
        contents: messagepayload.contents    // 👈 changed
      });

      console.log("Sent ai-response:", response);
    });
  });
}

module.exports = { initSocketServer };
