import React from 'react';
import './ChatMobileBar.css';
import './ChatLayout.css';


const ChatMobileBar = ({ onToggleSidebar, onNewChat }) => (
  <header className="chat-mobile-bar">
    <button className="chat-icon-btn" onClick={onToggleSidebar} aria-label="Toggle chat history">☰</button>
    <h1 className="chat-app-title">Chat</h1>
    <button className="chat-icon-btn" onClick={onNewChat} aria-label="New chat">＋</button>
  </header>
);

export default ChatMobileBar;