"use client";

import { useState, useTransition, useId, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectForm } from "./project-form";
import { Download, Edit, PlusCircle, Trash, ExternalLink, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { ADMIN_UID } from "@/lib/firebase";

const initialProjects: Project[] = [
  {
    id: '1',
    title: "AI Article Summarizer",
    description: "An AI-powered tool that provides concise summaries of long articles, making it easy to get key insights quickly.",
    tagline: "Get the gist, fast.",
    imageUrl: "https://placehold.co/600x400.png",
    liveUrl: "#",
    githubUrl: "#",
    tags: ["Next.js", "AI", "Tailwind CSS"]
  },
  {
    id: '2',
    title: "E-commerce Platform",
    description: "A full-featured e-commerce website with product listings, a shopping cart, and a secure checkout process.",
    tagline: "Your online store, simplified.",
    imageUrl: "https://placehold.co/600x400.png",
    liveUrl: "#",
    githubUrl: "#",
    tags: ["React", "Node.js", "Stripe"]
  },
];

const PortfolioForPrint = ({ projects }: { projects: Project[] }) => {
    return (
      <div className="print-container hidden print:block text-black bg-white p-8">
        <div className="text-center mb-12">
            <h1 className="font-headline text-5xl font-bold mb-2">Aditya Singh</h1>
            <p className="text-xl">Frontend Developer</p>
            <p className="text-sm">adityasingh.02@outlook.com | immortaladi.live</p>
        </div>
        <div className="mb-12">
            <h2 className="font-headline text-3xl font-bold border-b-2 border-gray-800 pb-2 mb-4">About Me</h2>
            <p>I'm a passionate Front-end developer from India with a knack for creating beautiful, intuitive, and high-performing web experiences. I love turning complex problems into simple, elegant solutions.</p>
        </div>
        <div>
            <h2 className="font-headline text-3xl font-bold border-b-2 border-gray-800 pb-2 mb-8">Projects</h2>
            <div className="space-y-10">
                {projects.map(p => (
                    <div key={p.id} className="project-item-print">
                        <h3 className="font-headline text-2xl font-semibold">{p.title}</h3>
                        {p.tagline && <p className="text-lg italic text-gray-600 mb-2">"{p.tagline}"</p>}
                        <p className="mb-2">{p.description}</p>
                        <p className="text-sm"><span className="font-semibold">Live:</span> {p.liveUrl} | <span className="font-semibold">GitHub:</span> {p.githubUrl}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  };
  

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const uniqueId = useId();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.uid !== ADMIN_UID)) {
      router.push('/');
    }
  }, [user, loading, router]);


  const handleAddNew = () => {
    setSelectedProject(null);
    setFormOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setFormOpen(true);
  };

  const handleDelete = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  const handleSave = (projectData: Project) => {
    if (selectedProject) {
      setProjects(
        projects.map((p) => (p.id === projectData.id ? projectData : p))
      );
    } else {
      setProjects([...projects, { ...projectData, id: `${uniqueId}-${projects.length + 1}` }]);
    }
    setFormOpen(false);
    setSelectedProject(null);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !user || user.uid !== ADMIN_UID) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Verifying access...</p>
        </div>
    )
  }

  return (
    <>
    <div className="min-h-screen bg-secondary/50 p-4 sm:p-8 print:hidden">
      <style jsx global>{`
        @media print {
            body * {
                visibility: hidden;
            }
            .print-container, .print-container * {
                visibility: visible;
            }
            .print-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
        }
      `}</style>
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <Link href="/" className="font-headline text-2xl font-bold text-primary">DevCard</Link>
            <h1 className="text-2xl font-bold font-headline">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handlePrint}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
            <ThemeToggle />
            <Button asChild>
                <Link href="/">
                    View Site <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </header>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Projects</h2>
            <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNew}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedProject ? "Edit Project" : "Add New Project"}
                  </DialogTitle>
                </DialogHeader>
                <ProjectForm
                  project={selectedProject}
                  onSave={handleSave}
                  onCancel={() => setFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden lg:table-cell">Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        width={60}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-sm truncate">{project.description}</TableCell>
                    <TableCell className="hidden lg:table-cell">{project.tags.join(', ')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the project.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-destructive hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-8">Note: This is a demo admin panel. Data is not persisted. In a real application, this page should be protected by authentication.</p>
    </div>
    <PortfolioForPrint projects={projects} />
    </>
  );
}
