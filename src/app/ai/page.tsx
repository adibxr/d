
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Bot, User } from 'lucide-react';
import Link from 'next/link';
import { askAboutMe } from '@/ai/flows/ask-about-me';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await askAboutMe({ question: input });
      const botMessage: Message = { role: 'bot', text: response.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        role: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/50 flex flex-col items-center p-4">
       <header className="w-full max-w-3xl mb-4">
        <Button variant="ghost" asChild>
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Portfolio
            </Link>
        </Button>
      </header>
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Bot /> Ask Me Anything
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary rounded-full p-2 text-primary-foreground">
                <Bot size={20}/>
              </div>
              <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                <p className="text-sm">Hello! Ask me anything about Aditya and his projects. How can I help you today?</p>
              </div>
            </div>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'bot' && (
                  <div className="bg-primary rounded-full p-2 text-primary-foreground">
                     <Bot size={20}/>
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                 {message.role === 'user' && (
                  <div className="bg-muted rounded-full p-2">
                     <User size={20}/>
                  </div>
                )}
              </motion.div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="bg-primary rounded-full p-2 text-primary-foreground">
                  <Bot size={20}/>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., What technologies does Aditya use?"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Send'
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

    