import React, { useCallback, useRef, useLayoutEffect } from 'react';
import './ChatComposer.css';

// NOTE: Public API (props) kept identical for drop-in upgrade
const ChatComposer = ({ input, setInput, onSend, isSending }) => {
  const textareaRef = useRef(null);

  // Auto-grow textarea height up to max-height
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 320) + 'px';
  }, [input]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) onSend();
    }
  }, [onSend, input]);

  return (
    <form className="composer" onSubmit={e => { e.preventDefault(); if (input.trim()) onSend(); }}>
      <div className="composer-surface" data-state={isSending ? 'sending' : undefined}>
        <div className="composer-field">
          <textarea
            ref={textareaRef}
            className="composer-input"
            placeholder="Message ChatGPT…"
            aria-label="Message"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            spellCheck
            autoComplete="off"
          />
          <div className="composer-hint" aria-hidden="true">Enter ↵ to send • Shift+Enter = newline</div>
        </div>
        <button
          type="submit"
            className="send-btn icon-btn"
            disabled={!input.trim() || isSending}
            aria-label={isSending ? 'Sending…' : 'Send message'}
        >
          <span className="send-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </form>
  );
};

export default ChatComposer;