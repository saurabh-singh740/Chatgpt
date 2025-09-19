import React, { useCallback, useEffect, useState } from 'react';
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';
import { fakeAIReply } from '../components/chat/aiClient.js';

const uid = () => Math.random().toString(36).slice(2, 11);

const Home = () => {
  // Previous chats list
  const [chats, setChats] = useState([]); // [{id, title, messages:[{id, role, content, ts}]}]
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile off-canvas

  const activeChat = chats.find(c => c.id === activeChatId) || null;
  const messages = activeChat ? activeChat.messages : [];

  const startNewChat = useCallback(() => {
    const id = uid();
    const newChat = { id, title: 'New Chat', messages: [] };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(id);
    setSidebarOpen(false);
  }, []);

  // Ensure at least one chat exists initially
  useEffect(() => {
    if (!activeChatId && chats.length === 0) startNewChat();
  }, [activeChatId, chats.length, startNewChat]);

  const updateChat = useCallback((chatId, updater) => {
    setChats(prev => prev.map(c => (c.id === chatId ? updater(c) : c)));
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || !activeChatId || isSending) return;
    setIsSending(true);
    const userMsg = { id: uid(), role: 'user', content: trimmed, ts: Date.now() };
    updateChat(activeChatId, c => ({
      ...c,
      title: c.messages.length === 0 ? trimmed.slice(0, 40) + (trimmed.length > 40 ? '…' : '') : c.title,
      messages: [...c.messages, userMsg]
    }));
    setInput('');
    try {
      const reply = await fakeAIReply(trimmed);
      const aiMsg = { id: uid(), role: 'ai', content: reply, ts: Date.now() };
      updateChat(activeChatId, c => ({ ...c, messages: [...c.messages, aiMsg] }));
  } catch {
      const errMsg = { id: uid(), role: 'ai', content: 'Error fetching AI response.', ts: Date.now(), error: true };
      updateChat(activeChatId, c => ({ ...c, messages: [...c.messages, errMsg] }));
    } finally {
      setIsSending(false);
    }
  }, [input, activeChatId, isSending, updateChat]);

  return (
  <div className="chat-layout minimal">
      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onNewChat={startNewChat}
      />
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => { setActiveChatId(id); setSidebarOpen(false); }}
        onNewChat={startNewChat}
        open={sidebarOpen}
      />
      <main className="chat-main" role="main">
        {messages.length === 0 && (
          <div className="chat-welcome" aria-hidden="true">
            <div className="chip">Early Preview</div>
            <h1>ChatGPT Clone</h1>
            <p>Ask anything. Paste text, brainstorm ideas, or get quick explanations. Your chats stay in the sidebar so you can pick up where you left off.</p>
          </div>
        )}
        <ChatMessages messages={messages} isSending={isSending} />
        <ChatComposer
          input={input}
          setInput={setInput}
            onSend={sendMessage}
          isSending={isSending}
        />
      </main>
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;