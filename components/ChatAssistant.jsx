'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ChefHat,
  ShoppingBag,
  ExternalLink,
  Flame,
  Clock,
  Check,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { label: '🇮🇳 தமிழ்', prompt: 'ராகி தோசை எப்படி செய்வது? செய்முறை சொல்லுங்கள்.' },
  { label: '🗣️ Tanglish', prompt: 'Adai dosa epdi crispy-ah panradhu? Enna recipe?' },
  { label: '🇬🇧 English', prompt: 'Which mix is best for diabetic friendly breakfast?' },
  { label: '🍲 Sambar', prompt: 'Instant Sambar mix epdi 5 mins-la cook panradhu?' },
];

export default function ChatAssistant({ isOpen, onToggle, onAddToCart }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'வணக்கம் & Welcome to Chummy Foods! I am your AI Nutritionist & Heritage Chef. Ask me recipes, cooking tips, or product recommendations in Tamil (தமிழ்), Tanglish, or English!',
      language: 'Multi',
      quickActions: [
        'ராகி தோசை செய்முறை (Tamil)',
        'Adai dosa epdi panradhu? (Tanglish)',
        'High protein breakfast ideas (English)',
      ],
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMessageId = Date.now().toString();
    const newUserMsg = {
      id: userMessageId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.data.reply,
          language: data.data.languageDetected,
          recommendedProducts: data.data.recommendedProducts || [],
          prepInstructions: data.data.prepInstructions || [],
          cookingTime: data.data.cookingTime || null,
          quickActions: data.data.quickActions || [],
          comboCartUrl: data.data.comboCartUrl || null,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Failed to get reply');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            'மன்னிக்கவும், Sorry! Could not process the request right now. Please select one of our curated products or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Docked Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          <div className="hidden sm:flex bg-chummy-plum text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-white/20 items-center gap-1.5 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-chummy-yellow"></span>
            <span>தமிழ் / Tanglish AI Assistant</span>
          </div>

          <button
            onClick={onToggle}
            className="relative w-14 h-14 rounded-2xl bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum font-bold shadow-chummy-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group glow-amber"
            aria-label="Open AI Assistant"
          >
            <ChefHat className="w-7 h-7 text-chummy-plum group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-chummy-maroon border-2 border-white flex items-center justify-center text-[9px] text-white font-extrabold">
              AI
            </span>
          </button>
        </div>
      )}

      {/* Docked Chat Assistant Drawer/Popup */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col justify-between overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="bg-chummy-plum text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-chummy-yellow flex items-center justify-center text-chummy-plum shadow-sm">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">Chummy AI Chef</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[11px] text-stone-300">
                  தமிழ் • Tanglish • English
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome',
                      role: 'assistant',
                      content:
                        'வணக்கம் & Welcome! Ask me any recipe, cooking secret, or product question in Tamil, Tanglish, or English.',
                      language: 'Multi',
                      timestamp: 'Just now',
                    },
                  ])
                }
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFFDF9]/60">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  {/* Language pill indicator */}
                  {!isUser && msg.language && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase">
                      {msg.language} Response
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-chummy-plum text-white rounded-br-none shadow-xs font-medium'
                        : 'bg-white text-stone-800 border border-stone-200/90 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Step-by-Step Cooking Instructions */}
                    {msg.prepInstructions && msg.prepInstructions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-100 space-y-1.5 bg-amber-50/60 p-2.5 rounded-xl">
                        <div className="text-[11px] font-bold text-amber-900 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-amber-600" />
                            <span>Step-by-Step Cooking Steps</span>
                          </span>
                          {msg.cookingTime && (
                            <span className="flex items-center gap-1 text-[10px] text-stone-500">
                              <Clock className="w-3 h-3" /> {msg.cookingTime}
                            </span>
                          )}
                        </div>

                        <ol className="list-decimal list-inside space-y-1 text-xs text-stone-700">
                          {msg.prepInstructions.map((step, idx) => (
                            <li key={idx} className="leading-snug">{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Recommended Real Product Cards from chummy_products.json */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Matching Real Mixes:</span>
                        </div>

                        <div className="space-y-2">
                          {msg.recommendedProducts.map((p) => (
                            <div
                              key={p.id}
                              className="bg-white rounded-xl p-2.5 border border-amber-200 flex items-center justify-between gap-2 shadow-xs"
                            >
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-10 h-10 object-contain shrink-0"
                              />

                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-chummy-plum truncate">{p.title}</div>
                                <div className="text-xs font-black text-amber-800">₹{p.price}</div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => onAddToCart && onAddToCart(p)}
                                  className="p-1.5 rounded-lg bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum font-bold text-[11px] flex items-center gap-1 shadow-xs"
                                  title="Add to app cart"
                                >
                                  <ShoppingBag className="w-3 h-3" /> Add
                                </button>
                                <a
                                  href={p.cartUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600"
                                  title="Direct Shopify cart"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Direct Combo Cart URL */}
                        {msg.comboCartUrl && (
                          <a
                            href={msg.comboCartUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center mt-2 py-1.5 px-3 rounded-lg bg-chummy-maroon text-white font-bold text-[11px] hover:bg-rose-900 transition-colors shadow-xs"
                          >
                            🛒 Add Recommended Products to Shopify Cart
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-stone-400 px-1">{msg.timestamp}</span>

                  {/* Contextual Quick Actions */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(action)}
                          className="text-[11px] bg-white hover:bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-full transition-colors font-medium shadow-xs"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded-2xl w-28 shadow-xs">
                <span className="text-xs text-stone-500 font-medium">Chef thinking</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Carousel (when few messages) */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-stone-50 border-t border-stone-200/80 overflow-x-auto flex gap-1.5 scrollbar-none">
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-medium shrink-0 shadow-xs"
                >
                  <strong className="text-amber-800">{item.label}:</strong> {item.prompt.substring(0, 24)}...
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask in தமிழ், Tanglish, or English..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:bg-white text-chummy-plum placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 rounded-xl bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum disabled:opacity-40 transition-all shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}

