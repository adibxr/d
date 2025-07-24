export interface Project {
  id: string;
  title: string;
  description: string;
  tagline?: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
}
