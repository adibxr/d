
"use client";

import { useState, useEffect } from "react";
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
import { Edit, PlusCircle, Trash, ExternalLink, Loader2 } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { db, ref, onValue, remove as removeProject, off } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setProjects(projectList);
      } else {
        setProjects([]);
      }
      setLoading(false);
    });

    return () => off(projectsRef, 'value', unsubscribe);
  }, []);
  
  const handleAddNew = () => {
    setSelectedProject(null);
    setFormOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setFormOpen(true);
  };

  const handleDelete = (projectId: string) => {
    const projectRef = ref(db, `projects/${projectId}`);
    removeProject(projectRef);
  };

  const handleSaveComplete = () => {
    setFormOpen(false);
    setSelectedProject(null);
  };

  if (authLoading || loading) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-secondary/30">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                    <Link href="/" className="font-headline text-2xl font-bold text-primary">Adi</Link>
                    <h1 className="text-xl font-bold font-headline text-foreground/80 hidden sm:block">Admin Panel</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/">
                            View Site <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-headline">Manage Projects</h2>
            <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogTrigger asChild>
                <Button onClick={handleAddNew} className="shadow-md">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New
                </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">
                    {selectedProject ? "Edit Project" : "Add New Project"}
                    </DialogTitle>
                </DialogHeader>
                <ProjectForm
                    project={selectedProject}
                    onSave={handleSaveComplete}
                    onCancel={() => setFormOpen(false)}
                />
                </DialogContent>
            </Dialog>
        </div>
        
        <Card className="shadow-lg">
            <CardContent className="p-0">
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px] p-4">Image</TableHead>
                    <TableHead className="p-4">Title</TableHead>
                    <TableHead className="hidden md:table-cell p-4">Description</TableHead>
                    <TableHead className="hidden lg:table-cell p-4">Tags</TableHead>
                    <TableHead className="text-right p-4">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                        No projects found. Get started by adding one!
                        </TableCell>
                    </TableRow>
                    ) : (
                    projects.map((project) => (
                        <TableRow key={project.id} className="hover:bg-muted/50">
                        <TableCell className="p-4">
                            <Image
                            src={project.imageUrl}
                            alt={project.title}
                            width={80}
                            height={50}
                            className="rounded-md object-cover aspect-video"
                            />
                        </TableCell>
                        <TableCell className="font-medium p-4">{project.title}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-sm truncate p-4">{project.description}</TableCell>
                        <TableCell className="hidden lg:table-cell p-4">
                            <div className="flex flex-wrap gap-1">
                                {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                            </div>
                        </TableCell>
                        <TableCell className="text-right p-4">
                            <div className="flex justify-end gap-1">
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
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the project from your database.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-destructive hover:bg-destructive/90">
                                    Delete Project
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
                </Table>
            </div>
            </CardContent>
        </Card>
       </main>
    </div>
  );
}
