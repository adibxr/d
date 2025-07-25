"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Bot, Loader2 } from "lucide-react";
import { db, ref, push, set } from '@/lib/firebase';
import { useState } from "react";
import { generateProjectTagline } from "@/ai/flows/generate-project-tagline";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tagline: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL"),
  liveUrl: z.string().url("Must be a valid URL"),
  githubUrl: z.string().url("Must be a valid URL"),
  tags: z.string().min(1, "At least one tag is required"),
});

type ProjectFormValues = z.infer<typeof formSchema>;

type ProjectFormProps = {
  project: Project | null;
  onSave: () => void;
  onCancel: () => void;
};

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      tagline: project?.tagline || "",
      imageUrl: project?.imageUrl || "https://placehold.co/600x400.png",
      liveUrl: project?.liveUrl || "",
      githubUrl: project?.githubUrl || "",
      tags: project?.tags?.join(", ") || "",
    },
  });

  const handleGenerateTagline = async () => {
    const title = form.getValues("title");
    const description = form.getValues("description");
    if (!title || !description) {
      toast({
        title: "Heads up!",
        description: "Please fill out the title and description first.",
        variant: "default",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateProjectTagline({
        projectName: title,
        projectDescription: description,
      });
      if (result.tagline) {
        form.setValue("tagline", result.tagline);
        toast({
          title: "Tagline Generated!",
          description: "The AI-powered tagline has been added.",
        });
      }
    } catch (error) {
      console.error("Failed to generate tagline:", error);
      toast({
        title: "Error",
        description: "Couldn't generate a tagline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };


  const onSubmit = async (values: ProjectFormValues) => {
    setIsSaving(true);
    const projectData = {
      ...values,
      tags: values.tags.split(",").map((tag) => tag.trim()),
    };
    
    try {
        if (project) {
            const projectRef = ref(db, `projects/${project.id}`);
            await set(projectRef, projectData);
            toast({ title: "Success", description: "Project updated successfully." });
        } else {
            const projectsRef = ref(db, 'projects');
            const newProjectRef = push(projectsRef);
            await set(newProjectRef, projectData);
            toast({ title: "Success", description: "Project added successfully." });
        }
        onSave();
    } catch (error) {
        console.error("Failed to save project:", error);
        toast({ title: "Error", description: "Failed to save project.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., My Awesome App" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
               <div className="flex gap-2">
                <FormControl>
                    <Input placeholder="A catchy phrase for your project" {...field} />
                </FormControl>
                 <Button type="button" variant="outline" size="icon" onClick={handleGenerateTagline} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-primary" />}
                    <span className="sr-only">Generate Tagline</span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://placehold.co/600x400.png" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="liveUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Live Demo URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://github.com/user/repo" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                    <Input placeholder="React, Next.js, Tailwind" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Project
          </Button>
        </div>
      </form>
    </Form>
  );
}
