'use client';

import {useState} from 'react';
import {qna, QnaInput} from '@/ai/flows/qna-flow';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {motion} from 'framer-motion';
import {Bot, User, Loader2} from 'lucide-react';
import {ThemeToggle} from '@/components/theme-toggle';
import Link from 'next/link';
import {useAuth} from '@/hooks/use-auth';

type Message = {
  text: string;
  isUser: boolean;
};

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {text: input, isUser: true};
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await qna({question: input});
      const aiMessage: Message = {text: result.answer, isUser: false};
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-secondary/30">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-headline text-2xl font-bold text-primary">Adi</Link>
                        <h1 className="text-xl font-bold font-headline text-foreground/80 hidden sm:block">AI Assistant</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {user && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin">Admin Panel</Link>
                            </Button>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl h-[70vh] flex flex-col shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-center">Ask Me Anything</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto p-6">
            <div className="flex-1 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.isUser ? 'justify-end' : ''
                  }`}
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.3}}
                >
                  {!message.isUser && (
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      <Bot size={20} />
                    </span>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg max-w-sm ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                   {message.isUser && (
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
                      <User size={20} />
                    </span>
                  )}
                </motion.div>
              ))}
               {isLoading && (
                 <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                        <Loader2 size={20} className="animate-spin" />
                    </span>
                    <div className="px-4 py-2 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Thinking...</p>
                    </div>
                 </div>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
