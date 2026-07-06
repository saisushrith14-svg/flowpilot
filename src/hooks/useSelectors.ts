import { useApp } from '@/context/AppContext';

export function useUser(userId: string) {
  const { users } = useApp();
  return users.find((u) => u.id === userId);
}

export function useProject(projectId: string) {
  const { projects } = useApp();
  return projects.find((p) => p.id === projectId);
}

export function useProjectTasks(projectId: string) {
  const { tasks } = useApp();
  return tasks.filter((t) => t.projectId === projectId);
}

export function useUnreadNotifications() {
  const { notifications } = useApp();
  return notifications.filter((n) => !n.read);
}
