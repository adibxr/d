
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Github, Linkedin, Twitter, Mail, ArrowRight, Rss, User as UserIcon, LogIn, LogOut, Loader2, Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import type { Project } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { signOut, auth, db, ref, onValue, off } from '@/lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';


const socialLinks = [
  { icon: Github, href: "https://github.com/adibxr", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com/adibxr", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/adi.bxr", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/adityasingh-02/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:ccidcop@gmail.com", label: "Email" },
];

const techStack = [
    { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
    { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "HTML5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS3", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "Cloudflare", logo: "https://cdn.worldvectorlogo.com/logos/cloudflare.svg" },
];

function AuthButton() {
    const { user, loading } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    if (loading) {
        return <Button variant="ghost" size="icon" disabled><Loader2 className="animate-spin" /></Button>
    }
    
    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <UserIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/admin">Admin</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} disabled={loggingOut}>
                        {loggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
                <LogIn />
            </Link>
        </Button>
    )
}

function Header() {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.header 
            className="fixed top-4 left-0 right-0 z-50 flex justify-center"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="container mx-auto px-4 py-2 bg-background/50 backdrop-blur-lg rounded-full border border-foreground/10 shadow-lg max-w-5xl">
            <div className="flex justify-between items-center h-12">
              <Link href="/" className="text-2xl font-headline font-bold text-primary flex items-center gap-2">
                <Image 
                    src="https://raw.githubusercontent.com/adibxr/public/main/logo.png"
                    alt="Aditya Raj"
                    width={40}
                    height={40}
                    className="rounded-full object-cover border-2 border-primary/50"
                  />
                <span className="hidden sm:inline">Adi</span>
              </Link>
              <div className="flex items-center gap-1">
                <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-full">
                    <a href="#about" onClick={(e) => handleScroll(e, '#about')} className="cursor-pointer text-sm font-medium hover:bg-background/70 hover:text-primary transition-colors px-4 py-1.5 rounded-full">ABOUT</a>
                    <a href="#projects" onClick={(e) => handleScroll(e, '#projects')} className="cursor-pointer text-sm font-medium hover:bg-background/70 hover:text-primary transition-colors px-4 py-1.5 rounded-full">PROJECTS</a>
                    <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="cursor-pointer text-sm font-medium hover:bg-background/70 hover:text-primary transition-colors px-4 py-1.5 rounded-full">CONTACT</a>
                    <Link href="/ai" className="cursor-pointer text-sm font-medium hover:bg-background/70 hover:text-primary transition-colors px-4 py-1.5 rounded-full">AI</Link>
                </nav>
                <div className="flex items-center gap-1">
                    <AuthButton />
                    <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </motion.header>
    );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ProjectCard({ project, index }: { project: Project, index: number }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader>
          <div className="aspect-video overflow-hidden rounded-md mb-4">
            <Image src={project.imageUrl} alt={project.title} width={600} height={400} className="object-cover w-full h-full transition-transform duration-500 hover:scale-105" data-ai-hint="project image" />
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
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="relative z-10 group">
                    <span className="absolute inset-0 bg-white/10 dark:bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    <span className="relative flex items-center">
                        <Github className="mr-2" /> GitHub
                    </span>
                </Link>
            </Button>
            <Button asChild>
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="relative z-10 group">
                    <span className="absolute inset-0 bg-white/20 dark:bg-black/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    <span className="relative flex items-center">
                        Live Demo <ArrowRight className="ml-2" />
                    </span>
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const projectsList = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
            setProjects(projectsList);
        }
        setLoading(false);
    });

    return () => off(projectsRef, 'value', unsubscribe);
  }, []);


  return (
    <div className="bg-background text-foreground relative overflow-hidden">
      <div className="fixed inset-0 select-none pointer-events-none z-0">
            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[24vw] font-bold text-foreground/5 dark:text-foreground/5 font-headline">
                    ADIBXR
                </p>
            </div>
      </div>
      <Header />
      
      <main className="container mx-auto px-4 pt-28 relative z-10">
        <motion.section 
          id="about" 
          className="py-24 text-center"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { delay: 0.2, type: 'spring' } }}
            >
              <Image 
                src="https://raw.githubusercontent.com/adibxr/public/main/logo.png"
                alt="Aditya Raj"
                width={200}
                height={200}
                className="rounded-full object-cover border-4 border-primary shadow-lg"
                data-ai-hint="profile picture"
              />
              <div className="absolute bottom-2 -left-2 bg-background/80 backdrop-blur-sm rounded-full p-1">
                <div className="flex items-center gap-2 bg-green-500/20 text-green-400 rounded-full px-3 py-1 text-sm border border-green-500/50">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Available
                </div>
              </div>
            </motion.div>
            <motion.h1 
              className="font-headline text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            >
              Aditya Raj
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-primary font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            >
              Frontend Developer | ReactJS | NextJS | UI/UX Enthusiast
            </motion.p>
            <motion.p 
              className="max-w-2xl mx-auto text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
            >
              Hi! My name is Aditya. I'm a web developer and digital visual artist. I love creating things that exist on the internet. My interest in web development started in 2021 when I decided to upload my digital concept arts online.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
            >
                <Button size="lg" asChild>
                  <a href="mailto:ccidcop@gmail.com">
                    Get in Touch <ArrowRight className="ml-2" />
                  </a>
                </Button>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
            id="tech-stack"
            className="py-24 text-center"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12">My Tech Stack</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
                {techStack.map((tech, index) => (
                    <motion.div
                        key={tech.name}
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        title={tech.name}
                    >
                        <div className="p-4 bg-muted/50 rounded-full w-24 h-24 flex items-center justify-center transition-all duration-300 hover:bg-primary/10 hover:shadow-lg hover:scale-110">
                            <Image
                                src={tech.logo}
                                alt={tech.name}
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
        
        <motion.section 
          id="projects" 
          className="py-24"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
            My Work
          </h2>
          {loading ? (
             <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </motion.section>
        
        <motion.section 
          id="contact" 
          className="py-24 text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">
            Let's Connect
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Feel free to reach out!
          </p>
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }}
          >
            {socialLinks.map((social, index) => (
               <motion.div
                key={social.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
              >
              <Button variant="outline" size="icon" asChild>
                <Link href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                  <social.icon />
                </Link>
              </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>
      
      <footer className="py-8 border-t relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Aditya Raj. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

    

    