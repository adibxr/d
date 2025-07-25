
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, User, Briefcase, Wand2, Smile, Mail, Github, ArrowLeft, Bot, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { askAboutMe } from '@/ai/flows/ask-about-me';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const suggestionChips = [
    { label: "About Me", icon: User, prompt: "Tell me about Aditya" },
    { label: "Projects", icon: Briefcase, prompt: "What are Aditya's projects?" },
    { label: "Skills", icon: Wand2, prompt: "What technologies does Aditya know?" },
    { label: "Fun Fact", icon: Smile, prompt: "Tell me a fun fact about Aditya" },
    { label: "Contact", icon: Mail, prompt: "How can I contact Aditya?" },
]

interface Message {
  text: string;
  isUser: boolean;
}

export default function AiChatPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim() || loading) return;

    const userMessage: Message = { text: prompt, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await askAboutMe({ question: prompt });
      const botMessage: Message = { text: result.answer, isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = { text: 'Sorry, I encountered an error. Please try again.', isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-between p-4 antialiased overflow-hidden relative">
        <div className="fixed inset-0 select-none pointer-events-none z-0">
            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[24vw] font-bold text-foreground/5 dark:text-foreground/5 font-headline">
                    ADIBXR
                </p>
            </div>
        </div>
        <div className="fixed top-0 left-0 w-full flex justify-between items-center p-4 md:p-6 z-20">
            <Button variant="outline" className="rounded-full" asChild>
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
                <Link href="https://github.com/adibxr" target="_blank">
                    <Github className="mr-2 h-4 w-4" /> Star on GitHub
                </Link>
            </Button>
        </div>

        <div className="w-full max-w-2xl flex-grow flex flex-col justify-end pt-24 pb-4 z-10">
             <AnimatePresence>
                {messages.length === 0 && (
                     <motion.div 
                        className="w-full max-w-2xl text-center self-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20}}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                        >
                            <Image 
                                src="https://raw.githubusercontent.com/adibxr/public/main/logo.png"
                                alt="Aditya Raj"
                                width={128}
                                height={128}
                                className="rounded-full object-cover border-4 border-primary/50 shadow-lg mx-auto mb-6"
                                data-ai-hint="profile picture"
                            />
                        </motion.div>
                        
                        <h1 className="text-xl md:text-2xl text-muted-foreground">Hey, I'm Aditya 👋</h1>
                        <p className="text-4xl md:text-6xl font-bold font-headline mt-2 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">AI Portfolio</p>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] pr-4">
                <AnimatePresence>
                {messages.map((message, index) => (
                    <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : ''}`}
                    >
                    {!message.isUser && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                    )}
                    <div
                        className={`max-w-md p-3 rounded-2xl ${
                        message.isUser
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted rounded-bl-none'
                        }`}
                    >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>
                     {message.isUser && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                    )}
                    </motion.div>
                ))}
                </AnimatePresence>
                 {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                    >
                         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div className="max-w-md p-3 rounded-2xl bg-muted rounded-bl-none flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>

      <div className="w-full max-w-2xl sticky bottom-4 z-10">
        {messages.length === 0 && (
             <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-4">
                {suggestionChips.map((chip) => (
                    <motion.div
                        key={chip.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + suggestionChips.indexOf(chip) * 0.1 }}
                    >
                        <Button 
                            variant="outline" 
                            className="rounded-full bg-background/50 backdrop-blur-lg"
                            onClick={() => handleSendMessage(chip.prompt)}
                            disabled={loading}
                        >
                            <chip.icon className="mr-2 h-4 w-4" />
                            {chip.label}
                        </Button>
                    </motion.div>
                ))}
            </div>
        )}
       
        <form onSubmit={handleSubmit} className="relative w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full rounded-full h-14 pl-6 pr-16 text-base bg-background/50 backdrop-blur-lg"
            disabled={loading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10"
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
