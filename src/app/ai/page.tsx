
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, User, Briefcase, Wand2, Smile, Mail, Github, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { askAboutMe } from '@/ai/flows/ask-about-me';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

const suggestionChips = [
    { label: "About Me", icon: User, prompt: "Tell me about Aditya" },
    { label: "Projects", icon: Briefcase, prompt: "What are Aditya's projects?" },
    { label: "Skills", icon: Wand2, prompt: "What technologies does Aditya know?" },
    { label: "Fun Fact", icon: Smile, prompt: "Tell me a fun fact about Aditya" },
    { label: "Contact", icon: Mail, prompt: "How can I contact Aditya?" },
]

export default function AiChatPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const result = await askAboutMe({ question: prompt });
      setResponse(result.answer);
      setAlertOpen(true);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setResponse('Sorry, I encountered an error. Please try again.');
      setAlertOpen(true);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 antialiased overflow-hidden">
        <div className="fixed top-0 left-0 w-full flex justify-between items-center p-4 md:p-6">
            <Button variant="outline" className="rounded-full" asChild>
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
                <Link href="https://github.com/adibxr" target="_blank">
                    <Github className="mr-2 h-4 w-4" /> Star on GitHub
                </Link>
            </Button>
        </div>

      <motion.div 
        className="w-full max-w-2xl text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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

        <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto mb-6">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full rounded-full h-14 pl-6 pr-16 text-lg"
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

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {suggestionChips.map((chip) => (
                <motion.div
                    key={chip.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + suggestionChips.indexOf(chip) * 0.1 }}
                >
                    <Button 
                        variant="outline" 
                        className="rounded-full"
                        onClick={() => handleSendMessage(chip.prompt)}
                        disabled={loading}
                    >
                        <chip.icon className="mr-2 h-4 w-4" />
                        {chip.label}
                    </Button>
                </motion.div>
            ))}
        </div>
      </motion.div>

       <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>AdiBot's Response</AlertDialogTitle>
            <AlertDialogDescription className="py-4">
              {response}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
