import { delay } from '@/utils/helpers';
import { API_DELAYS } from '@/constants';
import tasksData from '@/data/tasks.json';
import type { Task } from '@/types';

export async function fetchTasks(): Promise<Task[]> {
  await delay(API_DELAYS.MEDIUM);
  return tasksData as Task[];
}

export async function fetchTaskById(id: string): Promise<Task | undefined> {
  await delay(API_DELAYS.SHORT);
  return (tasksData as Task[]).find((t) => t.id === id);
}

export async function fetchTasksByProject(projectId: string): Promise<Task[]> {
  await delay(API_DELAYS.SHORT);
  return (tasksData as Task[]).filter((t) => t.projectId === projectId);
}

export async function createTaskApi(task: Task): Promise<Task> {
  await delay(API_DELAYS.LONG);
  return task;
}

export async function updateTaskApi(task: Task): Promise<Task> {
  await delay(API_DELAYS.MEDIUM);
  return task;
}

export async function deleteTaskApi(id: string): Promise<string> {
  await delay(API_DELAYS.MEDIUM);
  return id;
}
