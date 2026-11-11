import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageCircle,
  Sparkles,
  CheckCircle,
  GraduationCap,
  Circle,
  Clock,
} from 'lucide-react';
import { api } from '../services/api';

export const ChatModal = ({ recipient, currentUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChat = async () => {
    if (!recipient || !currentUser) return;
    try {
      const res = await api.getMessages(currentUser.email, recipient.email);
      setMessages(res.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 4000); // Poll messages
    return () => clearInterval(interval);
  }, [recipient, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || sending) return;

    const messageText = text.trim();
    setText('');
    setSending(true);

    // Optimistic message append
    const tempMsg = {
      _id: 'temp-' + Date.now(),
      sender: currentUser.email,
      receiver: recipient.email,
      text: messageText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await api.sendMessage(currentUser.email, recipient.email, messageText);
      await fetchChat();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = [
    'Hey! Want to team up for the upcoming hackathon?',
    'Saw your skills! Need a teammate for my project.',
    'Let’s connect on GitHub and build something cool!',
  ];

  if (!recipient || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-lg w-full h-[600px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        {/* Chat Header */}
        <div className="bg-[#0a66c2] p-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={
                  recipient.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    recipient.name
                  )}`
                }
                alt={recipient.name}
                className="w-11 h-11 rounded-full border-2 border-white object-cover bg-white"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold leading-tight">{recipient.name}</h3>
                {recipient.branch && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-white/20 text-white">
                    {recipient.branch}
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{recipient.college}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Skills Banner */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-4 py-2 flex items-center gap-2 text-xs overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-gray-500 shrink-0">
            Skills:
          </span>
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-0.5">
            {recipient.skills?.map((s, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-white border border-blue-200 text-[#0a66c2] font-semibold px-2 py-0.5 rounded-full shrink-0"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc]">
          {loading ? (
            <div className="text-center py-8 text-xs text-gray-400">Loading conversation...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0a66c2] flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">
                  Start a conversation with {recipient.name}
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                  Discuss hackathon tracks, align on technical roles (Frontend, Backend, ML), and build a winning project together!
                </p>
              </div>

              {/* Quick Prompt Starters */}
              <div className="space-y-1.5 pt-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setText(prompt);
                    }}
                    className="block w-full text-left p-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-xs text-gray-700 transition-colors cursor-pointer"
                  >
                    💬 "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMine =
                msg.sender.toLowerCase() === currentUser.email.toLowerCase();

              const timeStr = msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              return (
                <div
                  key={msg._id || idx}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isMine
                        ? 'bg-[#0a66c2] text-white rounded-br-xs'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {timeStr}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions below messages if there's history */}
        {messages.length > 0 && (
          <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.slice(0, 2).map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(prompt)}
                className="text-[10px] bg-white border border-gray-300 hover:border-[#0a66c2] text-gray-600 hover:text-[#0a66c2] px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors"
              >
                + {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message ${recipient.name}...`}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200/70 focus:bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-500 rounded-full border border-transparent focus:border-[#0a66c2] focus:outline-hidden transition-all"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="w-10 h-10 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
