import React, { useState, useEffect, useRef } from 'react';
import { askCopilot } from '../services/api';
import { speakText, stopSpeaking } from '../services/audio';
import { SavedTrip } from '../types/travel';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  Compass,
  MessageSquare,
  Loader2,
  Check,
} from 'lucide-react';

interface CopilotChatViewProps {
  activeTrip?: SavedTrip | null;
  onAddDestinationToTrip?: (destName: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: string;
}

export const CopilotChatView: React.FC<CopilotChatViewProps> = ({
  activeTrip,
  onAddDestinationToTrip,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'ನಮಸ್ಕಾರ (Namaskara)! I am your Karnataka AI Travel Copilot. Whether you need a hidden coffee estate trail, authentic Udupi cuisine advice, Hoysala temple history, or Kannada phrases, ask me in English or Kannada (ಕನ್ನಡ)!',
      timestamp: 'Just now',
      language: 'en',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'kn'>('en');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await askCopilot(
        text,
        activeTrip ? { title: activeTrip.tripTitle, days: activeTrip.days.length } : null,
        selectedLanguage
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Web Speech Audio Playback
  const handleSpeak = (text: string, lang = 'en-IN') => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speakText(text, lang === 'kn' ? 'kn-IN' : 'en-IN').finally(() => {
      setIsSpeaking(false);
    });
  };

  // Browser Speech-to-Text Recognition
  const handleToggleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage === 'kn' ? 'kn-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition error', err);
      setIsListening(false);
    }
  };

  const samplePromptChips = [
    'Recommend a 3-day road trip from Bengaluru',
    'What is the best time to see Jog Falls?',
    'Teach me 5 essential Kannada dining phrases',
    'Find hidden waterfalls near Gokarna',
    'What is authentic Coorg Pandi or Mushroom Curry?',
    'Is Mullayanagiri safe in the monsoon?',
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 flex flex-col h-[82vh]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-amber-300 flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-stone-900 text-lg">Kannada Voice & AI Copilot</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                ಕರ್ನಾಟಕ AI
              </span>
            </div>
            <p className="text-xs text-stone-500">
              {activeTrip ? `Active Trip: ${activeTrip.tripTitle}` : 'Ready to guide your Karnataka discoveries'}
            </p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSelectedLanguage('en')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedLanguage === 'en' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLanguage('kn')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedLanguage === 'kn' ? 'bg-emerald-800 text-amber-300 shadow-sm' : 'text-stone-600'
            }`}
          >
            ಕನ್ನಡ (Kannada)
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
        <span className="font-semibold text-stone-400 shrink-0">Suggestions:</span>
        {samplePromptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium whitespace-nowrap transition-colors border border-stone-200 shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Timeline */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                  AI
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-amber-600 text-white rounded-tr-none font-medium'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] opacity-75">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeak(msg.text, msg.language)}
                      className="hover:opacity-100 flex items-center gap-1 text-stone-500 hover:text-emerald-800 font-semibold"
                      title="Speak audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                  You
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-stone-500 italic pl-10">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
            <span>Consulting Karnataka travel knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box with Voice Mic */}
      <div className="pt-3 border-t border-stone-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-white border border-stone-300 rounded-2xl p-2 shadow-sm focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/20"
        >
          {/* Speech-to-text mic */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-2.5 rounded-xl transition-colors ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-700" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              selectedLanguage === 'kn'
                ? 'ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ (ಉದಾ: ಹಂಪಿಗೆ ಹೋಗಲು ಉತ್ತಮ ಸಮಯ ಯಾವುದು?)...'
                : 'Ask anything about Karnataka road trips, food, or temples...'
            }
            className="flex-1 bg-transparent border-none text-xs text-stone-900 focus:outline-none px-2"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
