import React, { useEffect, useRef, useState } from 'react';
import { Leaf, MessageCircle, Minus, Plus, RotateCcw, Send, X } from 'lucide-react';
import chatbotService from '../../services/chatbotService';
import './chatbot.css';

const SUGGESTIONS = [
  'How do I submit a crop insurance claim?',
  'How can I compare mandi prices?',
  'Where can I find official scheme information?'
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('auto');
  const transcriptRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !minimized) transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy, open, minimized]);

  const send = async (text = draft) => {
    const message = text.trim();
    if (!message || busy) return;
    const previous = messages.slice(-8).map(({ role, text: turnText }) => ({ role, text: turnText }));
    setMessages(items => [...items, { role: 'user', text: message }]);
    setDraft('');
    setError('');
    setBusy(true);
    try {
      const response = await chatbotService.sendMessage(message, previous, language);
      setMessages(items => [...items, { role: 'assistant', text: response.answer }]);
    } catch (requestError) {
      setError(requestError.message || 'The assistant is unavailable right now. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    send();
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const startNewConversation = () => {
    if (busy) return;
    setMessages([]);
    setDraft('');
    setError('');
    inputRef.current?.focus();
  };

  return (
    <>
      {(!open || minimized) && (
        <button className="bkig-chat-launcher" type="button" onClick={() => { setOpen(true); setMinimized(false); }} aria-label="Open BKIG agricultural assistant">
          {minimized ? <Plus size={23} /> : <MessageCircle size={24} />}
          <span className="bkig-chat-launcher-pulse" />
        </button>
      )}

      {open && !minimized && (
        <section className="bkig-chat-window" aria-label="BKIG Agricultural Assistant" aria-live="polite">
          <header className="bkig-chat-header">
            <div className="bkig-chat-brand">
              <span className="bkig-chat-brand-icon"><Leaf size={19} /></span>
              <div>
                <h2>BKIG Agricultural Assistant</h2>
                <p>Practical guidance for your farm</p>
              </div>
            </div>
            <div className="bkig-chat-actions">
              <button type="button" onClick={startNewConversation} disabled={busy} aria-label="Start a new conversation" title="New conversation"><RotateCcw size={17} /></button>
              <button type="button" onClick={() => setMinimized(true)} aria-label="Minimize assistant" title="Minimize"><Minus size={18} /></button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" title="Close"><X size={18} /></button>
            </div>
          </header>

          <div className="bkig-chat-language">
            <label htmlFor="bkig-chat-language-select">Reply language</label>
            <select id="bkig-chat-language-select" value={language} onChange={event => setLanguage(event.target.value)} aria-label="Choose assistant reply language">
              <option value="auto">Auto detect</option>
              <option value="en">English</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          <div className="bkig-chat-transcript" ref={transcriptRef} role="log" aria-relevant="additions text">
            {messages.length === 0 ? (
              <div className="bkig-chat-welcome">
                <span className="bkig-chat-welcome-icon"><Leaf size={23} /></span>
                <h3>Namaste, farmer</h3>
                <p>Ask about farming, BKIG, crop insurance, market prices, or official scheme information.</p>
                <div className="bkig-chat-suggestions">
                  {SUGGESTIONS.map(question => <button type="button" key={question} onClick={() => send(question)} disabled={busy}>{question}</button>)}
                </div>
              </div>
            ) : messages.map((item, index) => (
              <div className={`bkig-chat-row ${item.role === 'user' ? 'is-user' : 'is-assistant'}`} key={`${index}-${item.role}`}>
                {item.role === 'assistant' && <span className="bkig-chat-avatar"><Leaf size={14} /></span>}
                <p className="bkig-chat-bubble">{item.text}</p>
              </div>
            ))}
            {busy && <div className="bkig-chat-row is-assistant"><span className="bkig-chat-avatar"><Leaf size={14} /></span><div className="bkig-chat-bubble bkig-chat-typing" aria-label="Assistant is responding"><i /><i /><i /></div></div>}
          </div>

          {error && <p className="bkig-chat-error" role="alert">{error}</p>}

          <form className="bkig-chat-composer" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              value={draft}
              onChange={event => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask an agricultural question…"
              aria-label="Message the BKIG agricultural assistant"
              maxLength={2000}
              rows={1}
              disabled={busy}
            />
            <button type="submit" disabled={busy || !draft.trim()} aria-label="Send message"><Send size={18} /></button>
            <span className="bkig-chat-composer-hint">Enter to send · Shift+Enter for a new line</span>
          </form>
        </section>
      )}
    </>
  );
}
