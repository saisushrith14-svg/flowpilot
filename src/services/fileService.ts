import { delay } from '@/utils/helpers';
import { API_DELAYS } from '@/constants';
import filesData from '@/data/files.json';
import type { FileItem } from '@/types';

export async function fetchFiles(): Promise<FileItem[]> {
  await delay(API_DELAYS.MEDIUM);
  return filesData as FileItem[];
}

export async function fetchFilesByProject(projectId: string): Promise<FileItem[]> {
  await delay(API_DELAYS.SHORT);
  return (filesData as FileItem[]).filter((f) => f.projectId === projectId);
}

export async function uploadFileApi(file: FileItem): Promise<FileItem> {
  await delay(API_DELAYS.LONG);
  return file;
}

export async function deleteFileApi(id: string): Promise<string> {
  await delay(API_DELAYS.MEDIUM);
  return id;
}
