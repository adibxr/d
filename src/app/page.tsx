
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Github, Linkedin, Twitter, Mail, ArrowRight, Rss, User as UserIcon, LogIn, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { auth, provider, signInWithPopup, signOut } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const projects = [
  {
    title: "AI Article Summarizer",
    description: "An AI-powered tool that provides concise summaries of long articles, making it easy to get key insights quickly.",
    image: "https://placehold.co/600x400.png",
    imageHint: "abstract gradient",
    liveUrl: "#",
    githubUrl: "#",
    tags: ["Next.js", "AI", "Tailwind CSS"]
  },
  {
    title: "E-commerce Platform",
    description: "A full-featured e-commerce website with product listings, a shopping cart, and a secure checkout process.",
    image: "https://placehold.co/600x400.png",
    imageHint: "shopping online",
    liveUrl: "#",
    githubUrl: "#",
    tags: ["React", "Node.js", "Stripe"]
  },
  {
    title: "Project Management Tool",
    description: "A collaborative platform for teams to manage tasks, track progress, and communicate effectively on projects.",
    image: "https://placehold.co/600x400.png",
    imageHint: "team collaboration",
    liveUrl: "#",
    githubUrl: "#",
    tags: ["Vue.js", "Firebase", "SCSS"]
  }
];

const socialLinks = [
  { icon: Github, href: "https://github.com/adityasingh-02", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/adityasingh-02/", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/immortal_adi", label: "Twitter" },
  { icon: Mail, href: "mailto:adityasingh.02@outlook.com", label: "Email" },
];

function AuthButton() {
    const { user, loading } = useAuth();
    const { toast } = useToast();

    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            toast({ title: "Signed In", description: "You have successfully signed in." });
        } catch (error) {
            toast({ variant: "destructive", title: "Sign In Failed", description: "Could not sign you in with Google." });
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            toast({ title: "Signed Out", description: "You have successfully signed out." });
        } catch (error) {
            toast({ variant: "destructive", title: "Sign Out Failed", description: "Could not sign you out." });
        }
    };

    if (loading) {
        return <div className="w-9 h-9 bg-muted rounded-full animate-pulse" />;
    }

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar className="w-8 h-8">
                           <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                           <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleSignIn} aria-label="Sign In">
            <LogIn />
        </Button>
    );
}

function Header() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="container mx-auto px-4 py-2 bg-background/50 backdrop-blur-lg rounded-full border border-border/20 shadow-lg">
        <div className="flex justify-between items-center h-12">
          <Link href="/" className="text-2xl font-headline font-bold text-primary flex items-center gap-2">
            <Image 
                src="https://i.imgur.com/26rM2A5.png"
                alt="Aditya Singh"
                width={40}
                height={40}
                className="rounded-full object-cover border-2 border-primary/50"
              />
            <span className="hidden sm:inline">DevCard</span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-full">
              <Link href="#about" className="text-sm font-medium hover:bg-background/70 hover:text-primary transition-colors px-4 py-1.5 rounded-full">About</Link>
              <Link href="#projects" className="text-sm font-medium hover:bg-background/70 hover:text-primary transition-colors px-4 py-1.5 rounded-full">Projects</Link>
              <Link href="#contact" className="text-sm font-medium hover:bg-background/70 hover:text-primary transition-colors px-4 py-1.5 rounded-full">Contact</Link>
            </nav>
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="aspect-video overflow-hidden rounded-md mb-4">
          <Image src={project.image} alt={project.title} width={600} height={400} className="object-cover w-full h-full transition-transform duration-500 hover:scale-105" data-ai-hint={project.imageHint}/>
        </div>
        <CardTitle className="font-headline text-xl">{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-1 text-xs bg-secondary rounded-full">{tag}</span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2" /> GitHub
          </Link>
        </Button>
        <Button asChild>
          <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            Live Demo <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 pt-28">
        <section id="about" className="py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8">
              <Image 
                src="https://i.imgur.com/26rM2A5.png"
                alt="Aditya Singh"
                width={200}
                height={200}
                className="rounded-full object-cover border-4 border-primary shadow-lg"
                data-ai-hint="profile picture"
              />
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-4">
              Aditya Singh
            </h1>
            <p className="text-xl md:text-2xl text-primary font-medium mb-6">
              Frontend Developer | ReactJS | NextJS | UI/UX Enthusiast
            </p>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
              I'm a passionate Front-end developer from India with a knack for creating beautiful, intuitive, and high-performing web experiences. I love turning complex problems into simple, elegant solutions.
            </p>
            <Button size="lg" asChild>
              <Link href="#contact">
                Get in Touch <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
        
        <section id="projects" className="py-24">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
            My Work
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
        
        <section id="contact" className="py-24 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">
            Let's Connect
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Feel free to reach out!
          </p>
          <div className="flex justify-center gap-4">
            {socialLinks.map(social => (
              <Button key={social.label} variant="outline" size="icon" asChild>
                <Link href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                  <social.icon />
                </Link>
              </Button>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Aditya Singh. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
