
'use server';

import { db, ref, get } from '@/lib/firebase';
import type { Project } from '@/lib/types';

export async function getProjects(): Promise<Project[]> {
  try {
    const projectsRef = ref(db, 'projects');
    const snapshot = await get(projectsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const projectList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      return projectList;
    }
    return [];
  } catch (error) {
    console.error("Error fetching projects from Firebase:", error);
    return [];
  }
}

    