import { useState } from 'react';
import { Bell, Calendar, Check, Trash2, CheckCheck } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';
import { formatRelative } from '@/utils/helpers';
import { NOTIFICATION_CATEGORIES } from '@/constants';
import { cn } from '@/utils/cn';
import { Link } from 'react-router-dom';

export function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useApp();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = notifications.filter((n) => {
    const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter;
    const matchesRead = !showUnreadOnly || !n.read;
    return matchesCategory && matchesRead;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const categoryColors: Record<string, string> = {
    task: 'bg-blue-100 text-blue-700',
    project: 'bg-purple-100 text-purple-700',
    team: 'bg-emerald-100 text-emerald-700',
    system: 'bg-slate-100 text-slate-700',
    file: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Notifications' }]} />
          <h1 className="text-2xl font-bold mt-2">Notifications</h1>
          <p className="text-muted text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <FilterDropdown
          label="Category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[{ value: 'all', label: 'All' }, ...NOTIFICATION_CATEGORIES]}
        />
        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
            showUnreadOnly ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-slate-50'
          )}
        >
          Unread only
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title="No notifications"
          description="You're all caught up! New notifications will appear here."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => (
            <Card
              key={notif.id}
              padding="sm"
              className={cn(
                'transition-colors',
                !notif.read && 'border-primary/20 bg-primary/[0.02]'
              )}
            >
              <div className="flex items-start gap-4 p-2">
                <div className={cn('rounded-lg p-2.5 shrink-0', categoryColors[notif.category])}>
                  {notif.category === 'task' ? (
                    <Calendar className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={cn('text-sm font-medium', !notif.read && 'text-foreground')}>
                        {notif.title}
                      </p>
                      <p className="text-sm text-muted mt-0.5">{notif.message}</p>
                    </div>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className={categoryColors[notif.category]}>{notif.category}</Badge>
                    <span className="text-xs text-muted">{formatRelative(notif.createdAt)}</span>
                    {notif.link && (
                      <Link to={notif.link} className="text-xs text-primary hover:underline">
                        View
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-muted"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-danger"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
