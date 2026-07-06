import { delay } from '@/utils/helpers';
import { API_DELAYS } from '@/constants';
import projectsData from '@/data/projects.json';
import type { Project } from '@/types';

export async function fetchProjects(): Promise<Project[]> {
  await delay(API_DELAYS.MEDIUM);
  return projectsData as Project[];
}

export async function fetchProjectById(id: string): Promise<Project | undefined> {
  await delay(API_DELAYS.SHORT);
  return (projectsData as Project[]).find((p) => p.id === id);
}

export async function createProjectApi(project: Project): Promise<Project> {
  await delay(API_DELAYS.LONG);
  return project;
}

export async function updateProjectApi(project: Project): Promise<Project> {
  await delay(API_DELAYS.MEDIUM);
  return project;
}

export async function deleteProjectApi(id: string): Promise<string> {
  await delay(API_DELAYS.MEDIUM);
  return id;
}
