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
import { improveProjectDescription } from "@/ai/flows/improve-project-description";
import { generateProjectTagline } from "@/ai/flows/generate-project-tagline";
import { Sparkles, Bot, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tagline: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL"),
  liveUrl: z.string().url("Must be a valid URL"),
  githubUrl: z.string().url("Must be a valid URL"),
  tags: z.string().min(1, "At least one tag is required"),
});

type ProjectFormProps = {
  project: Project | null;
  onSave: (data: Project) => void;
  onCancel: () => void;
};

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const { toast } = useToast();
  const [isImproving, startImproving] = useTransition();
  const [isGenerating, startGenerating] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      tagline: project?.tagline || "",
      imageUrl: project?.imageUrl || "https://placehold.co/600x400.png",
      liveUrl: project?.liveUrl || "",
      githubUrl: project?.githubUrl || "",
      tags: project?.tags.join(", ") || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      id: project?.id || Date.now().toString(),
      ...values,
      tags: values.tags.split(",").map((tag) => tag.trim()),
    });
    toast({ title: "Success", description: "Project saved successfully." });
  };

  const handleImproveDescription = () => {
    const currentDescription = form.getValues("description");
    if (!currentDescription) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please enter a description first.",
        });
        return;
    }

    startImproving(async () => {
        try {
            const result = await improveProjectDescription({ projectDescription: currentDescription });
            if (result.improvedDescription) {
                form.setValue("description", result.improvedDescription, { shouldValidate: true });
                toast({ title: "AI Magic!", description: "Description improved." });
            }
            if (result.suggestedTagline && !form.getValues("tagline")) {
                form.setValue("tagline", result.suggestedTagline, { shouldValidate: true });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to improve description.",
            });
        }
    });
  };

  const handleGenerateTagline = () => {
    const title = form.getValues("title");
    const description = form.getValues("description");

    if (!title || !description) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please enter a title and description first.",
        });
        return;
    }

    startGenerating(async () => {
        try {
            const result = await generateProjectTagline({ projectName: title, projectDescription: description });
            form.setValue("tagline", result.tagline, { shouldValidate: true });
            toast({ title: "AI Magic!", description: "Tagline generated." });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate tagline.",
            });
        }
    });
  }

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
              <div className="relative">
                <FormControl>
                  <Textarea
                    placeholder="Describe your project..."
                    className="pr-12"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-primary" 
                    onClick={handleImproveDescription}
                    disabled={isImproving}
                    aria-label="Improve description with AI"
                >
                    {isImproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                </Button>
              </div>
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
               <div className="relative">
                <FormControl>
                    <Input placeholder="A catchy phrase for your project" {...field} />
                </FormControl>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1/2 -translate-y-1/2 right-1 text-primary" 
                    onClick={handleGenerateTagline}
                    disabled={isGenerating}
                    aria-label="Generate tagline with AI"
                >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
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
          <Button type="submit">Save Project</Button>
        </div>
      </form>
    </Form>
  );
}
