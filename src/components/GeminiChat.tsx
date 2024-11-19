import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageSquare, Send, Loader2, AlertCircle, X } from 'lucide-react';
import PlantCard from './PlantCard';

const PLANTS_DATA = [
  {
    name: "Giant Fennel",
    scientificName: "Ferula communis",
    description: "A characteristic Mediterranean plant reaching impressive heights, with delicate yellow flowers and finely divided leaves.",
    imageUrl: "https://images.unsplash.com/photo-1588905857770-54f72c5f979a?auto=format&fit=crop&q=80",
    uses: ["Traditional medicine", "Culinary (stems)", "Ornamental"],
    season: "Spring-Summer"
  },
  {
    name: "Mediterranean Thyme",
    scientificName: "Thymus vulgaris",
    description: "A fragrant herb commonly found in rocky areas, essential to local cuisine and traditional medicine.",
    imageUrl: "https://images.unsplash.com/photo-1600849000634-dba5ddd43c51?auto=format&fit=crop&q=80",
    uses: ["Cooking", "Tea", "Traditional remedies"],
    season: "Year-round"
  },
  {
    name: "Mastic Tree",
    scientificName: "Pistacia lentiscus",
    description: "An evergreen shrub typical of Mediterranean coastal areas, known for its aromatic resin.",
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80",
    uses: ["Resin production", "Traditional sweets", "Medicinal"],
    season: "Year-round"
  }
];

const INITIAL_MESSAGE = `Hi! I'm your local guide to Gümüşlük. I can tell you about:
• Marine life and swimming conditions
• Local plants and herbs
• Cultural attractions

What would you like to know?`;

const PROMPT_TEMPLATE = `You are a friendly local guide in Gümüşlük, Turkey. Keep your responses:
- Brief and easy to read (2-3 short paragraphs max)
- Focused on practical information
- Conversational in tone
- Split into short paragraphs with line breaks

Question: {question}`;

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
  showPlants?: boolean;
}

export default function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const genAI = useRef<GoogleGenerativeAI | null>(null);

  useEffect(() => {
    try {
      genAI.current = new GoogleGenerativeAI('AIzaSyD8IGQ5aA3Uuz6QyNot08ZHECaZCS4ww1E');
      if (!isInitialized.current) {
        isInitialized.current = true;
        setMessages([{ role: 'assistant', content: INITIAL_MESSAGE }]);
      }
    } catch (error) {
      console.error('Failed to initialize Gemini:', error);
      setError('Failed to initialize chat. Please try refreshing the page.');
    }
  }, []);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (prompt: string): Promise<string> => {
    if (!genAI.current) {
      throw new Error('Gemini AI is not initialized');
    }

    try {
      const model = genAI.current.getGenerativeModel({ model: "gemini-pro" });
      const formattedPrompt = PROMPT_TEMPLATE.replace('{question}', prompt);
      const result = await model.generateContent(formattedPrompt);
      const response = await result.response;
      return response.text().split('\n').filter(line => line.trim()).join('\n\n');
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    
    const isPlantQuery = userMessage.toLowerCase().includes('plant') || 
                        userMessage.toLowerCase().includes('herb') ||
                        userMessage.toLowerCase().includes('flora');
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      showPlants: isPlantQuery 
    }]);
    
    setIsLoading(true);

    try {
      const response = await generateResponse(userMessage);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        showPlants: isPlantQuery 
      }]);
    } catch (error) {
      const errorMessage = 'Failed to get a response. Please try again.';
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'error', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const QuickQuestion = ({ question }: { question: string }) => (
    <button
      onClick={() => {
        setInput(question);
        handleSubmit(new Event('submit') as any);
      }}
      className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
    >
      {question}
    </button>
  );

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Interface */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full bg-white shadow-xl flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Local Guide</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-100">
            <p className="text-sm text-gray-500">
              Ask me about Gümüşlük's attractions and nature
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <QuickQuestion question="What marine life can I see while swimming?" />
              <QuickQuestion question="Tell me about local plants" />
              <QuickQuestion question="Best time for swimming?" />
            </div>
          </div>

          <div 
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          >
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.role === 'error'
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-white text-gray-800 shadow-sm'
                    }`}
                  >
                    {message.role === 'error' && (
                      <AlertCircle className="w-4 h-4 inline-block mr-2" />
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {message.content}
                    </div>
                  </div>
                </div>
                {message.showPlants && message.role === 'assistant' && (
                  <div className="mt-4 space-y-4">
                    {PLANTS_DATA.map((plant, idx) => (
                      <PlantCard key={idx} plant={plant} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about Gümüşlük..."
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}