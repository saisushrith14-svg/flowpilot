import { delay } from '@/utils/helpers';
import { API_DELAYS } from '@/constants';
import usersData from '@/data/users.json';
import type { User } from '@/types';

export async function fetchUsers(): Promise<User[]> {
  await delay(API_DELAYS.MEDIUM);
  return usersData as User[];
}

export async function fetchUserById(id: string): Promise<User | undefined> {
  await delay(API_DELAYS.SHORT);
  return (usersData as User[]).find((u) => u.id === id);
}

export async function fetchCurrentUser(): Promise<User> {
  await delay(API_DELAYS.SHORT);
  return (usersData as User[])[0];
}
