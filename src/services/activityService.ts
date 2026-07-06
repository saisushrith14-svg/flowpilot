import { delay } from '@/utils/helpers';
import { API_DELAYS } from '@/constants';
import activityData from '@/data/activity.json';
import type { ActivityItem } from '@/types';

export async function fetchActivity(): Promise<ActivityItem[]> {
  await delay(API_DELAYS.MEDIUM);
  return activityData as ActivityItem[];
}

export async function fetchActivityByProject(projectId: string): Promise<ActivityItem[]> {
  await delay(API_DELAYS.SHORT);
  return (activityData as ActivityItem[]).filter((a) => a.projectId === projectId);
}
