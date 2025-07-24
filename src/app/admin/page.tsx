
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

const staticProjects: Project[] = [
    {
      id: '1',
      title: 'Sample Project 1',
      description: 'This is a description for the first sample project.',
      imageUrl: 'https://placehold.co/600x400.png',
      liveUrl: '#',
      githubUrl: '#',
      tags: ['React', 'Next.js'],
    },
    {
      id: '2',
      title: 'Sample Project 2',
      description: 'This is another sample project.',
      imageUrl: 'https://placehold.co/600x400.png',
      liveUrl: '#',
      githubUrl: '#',
      tags: ['TypeScript', 'ShadCN'],
    },
  ];

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  
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

  const handleSave = (projectData: Omit<Project, 'id'> & { id?: string }) => {
    if (projectData.id) {
        setProjects(projects.map((p) => (p.id === projectData.id ? { ...p, ...projectData } : p)));
    } else {
        setProjects([...projects, { ...projectData, id: String(Date.now()) }]);
    }
    setFormOpen(false);
    setSelectedProject(null);
  };


  return (
    <div className="min-h-screen bg-secondary/50 p-4 sm:p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <Link href="/" className="font-headline text-2xl font-bold text-primary">DevCard</Link>
            <h1 className="text-2xl font-bold font-headline">Admin Panel (Demo)</h1>
        </div>
        <div className="flex items-center gap-4">
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
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No projects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
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
                                This will remove the project from this demonstration.
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
