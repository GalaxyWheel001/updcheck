'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

function SupportChat({ isOpen, onClose }: SupportChatProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chat.welcomeMessage', { defaultValue: '👋 Hello! Welcome to TurboPlay Support! How can I help you today?' }),
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Формируем массив ответов на актуальном языке
    const botResponses = [
      t('chat.response1', { defaultValue: '🎰 If you have issues with spinning, please check if you have already spun today. You can spin once every 24 hours!' }),
      t('chat.response2', { defaultValue: '🎁 Your bonus will be automatically applied when you use the promocode at our partner casino!' }),
      t('chat.response3', { defaultValue: '🌍 We support multiple currencies and languages. Your location is automatically detected for the best experience!' }),
      t('chat.response4', { defaultValue: '💫 The wheel uses fair probability algorithms to ensure every spin is random and exciting!' }),
      t('chat.response5', { defaultValue: '📱 This website works perfectly on mobile devices. Try spinning on your phone!' }),
      t('chat.response6', { defaultValue: '⭐ Thank you for using TurboPlay! Is there anything else I can help you with?' })
    ];

    // Simulate bot response
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 300, y: 50 }}
          className="fixed bottom-4 right-4 w-80 h-96 bg-gray-900 rounded-xl border border-cyan-400 z-50 overflow-hidden"
          style={{
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-bold text-white orbitron text-sm">{t('chat.title')}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 h-64 overflow-y-auto space-y-2">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-gray-700 text-gray-100'
                      : 'bg-cyan-600 text-white'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    {message.isBot ? (
                      <Bot size={12} className="text-cyan-400" />
                    ) : (
                      <User size={12} className="text-gray-200" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.isBot ? 'Support' : 'You'}
                    </span>
                  </div>
                  <p>{message.text}</p>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-700 text-gray-100 p-2 rounded-lg text-sm max-w-[80%]">
                  <div className="flex items-center gap-1 mb-1">
                    <Bot size={12} className="text-cyan-400" />
                    <span className="text-xs opacity-70">Support</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chat.placeholder')}
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SupportChat;
