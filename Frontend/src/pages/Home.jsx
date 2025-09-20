import React, { useCallback, useEffect } from 'react';
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';
import { fakeAIReply } from '../components/chat/aiClient.js';
import { useDispatch, useSelector } from 'react-redux';
import {
  ensureInitialChat,
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  addUserMessage,
  addAIMessage
} from '../store/chatSlice.js';

const Home = () => {
  const dispatch = useDispatch();
  const chats = useSelector(state => state.chat.chats);
  const activeChatId = useSelector(state => state.chat.activeChatId);
  const input = useSelector(state => state.chat.input);
  const isSending = useSelector(state => state.chat.isSending);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const activeChat = chats.find(c => c.id === activeChatId) || null;
  const messages = activeChat ? activeChat.messages : [];

  const handleNewChat = useCallback(() => {
    // Prompt user for title of new chat, fallback to 'New Chat'
    let title = window.prompt('Enter a title for the new chat:', '');
    if (title) title = title.trim();
    if (!title) title = 'New Chat';
    dispatch(startNewChat(title));
    setSidebarOpen(false);
  }, [dispatch]);

  // Ensure at least one chat exists initially
  useEffect(() => {
    dispatch(ensureInitialChat());
  }, [dispatch]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || !activeChatId || isSending) return;
    dispatch(sendingStarted());
    dispatch(addUserMessage(activeChatId, trimmed));
    dispatch(setInput(''));
    try {
      const reply = await fakeAIReply(trimmed);
      dispatch(addAIMessage(activeChatId, reply));
  } catch {
      dispatch(addAIMessage(activeChatId, 'Error fetching AI response.', true));
    } finally {
      dispatch(sendingFinished());
    }
  }, [input, activeChatId, isSending, dispatch]);

  return (
  <div className="chat-layout minimal">
      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onNewChat={handleNewChat}
      />
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => { dispatch(selectChat(id)); setSidebarOpen(false); }}
        onNewChat={handleNewChat}
        open={sidebarOpen}
      />
      <main className="chat-main" role="main">
        {messages.length === 0 && (
          <div className="chat-welcome" aria-hidden="true">
            <div className="chip">Early Preview</div>
            <h1>Aurora</h1>
            <p>Ask anything. Paste text, brainstorm ideas, or get quick explanations. Your chats stay in the sidebar so you can pick up where you left off.</p>
          </div>
        )}
        <ChatMessages messages={messages} isSending={isSending} />
        <ChatComposer
          input={input}
          setInput={(v) => dispatch(setInput(v))}
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