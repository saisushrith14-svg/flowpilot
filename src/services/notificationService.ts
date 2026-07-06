import { delay } from '@/utils/helpers';
import { API_DELAYS } from '@/constants';
import notificationsData from '@/data/notifications.json';
import type { Notification } from '@/types';

export async function fetchNotifications(): Promise<Notification[]> {
  await delay(API_DELAYS.SHORT);
  return notificationsData as Notification[];
}

export async function markNotificationReadApi(id: string): Promise<string> {
  await delay(API_DELAYS.SHORT);
  return id;
}

export async function markAllNotificationsReadApi(): Promise<void> {
  await delay(API_DELAYS.MEDIUM);
}

export async function deleteNotificationApi(id: string): Promise<string> {
  await delay(API_DELAYS.SHORT);
  return id;
}
