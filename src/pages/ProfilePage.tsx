import { useForm } from 'react-hook-form';
import { MapPin, Globe, Mail, Phone } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { formatRelative } from '@/utils/helpers';
import type { UserProfile } from '@/types';

export function ProfilePage() {
  const { profile, updateProfile, activity, currentUser } = useApp();

  const { register, handleSubmit, formState: { isDirty } } = useForm<UserProfile>({
    defaultValues: profile,
  });

  const userActivity = activity.filter((a) => a.userId === currentUser?.id).slice(0, 5);

  const onSubmit = (data: UserProfile) => {
    updateProfile({ ...profile, ...data });
  };

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[{ label: 'Profile' }]} />
        <h1 className="text-2xl font-bold mt-2">Profile</h1>
        <p className="text-muted text-sm mt-1">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="text-center">
            <Avatar src={profile.avatar} name={profile.name} size="xl" className="mx-auto" />
            <h2 className="text-xl font-bold mt-4">{profile.name}</h2>
            <p className="text-muted text-sm">{currentUser?.role} · {currentUser?.department}</p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-4">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
          <div className="mt-6 space-y-3 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Mail className="h-4 w-4" /> {profile.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Phone className="h-4 w-4" /> {profile.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <MapPin className="h-4 w-4" /> {profile.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Globe className="h-4 w-4" /> {profile.website}
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardTitle className="mb-4">Personal Details</CardTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input {...register('name')} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input {...register('email')} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone</label>
                  <input {...register('phone')} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Location</label>
                  <input {...register('location')} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Bio</label>
                <textarea {...register('bio')} rows={3} className="w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Website</label>
                <input {...register('website')} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={!isDirty}>Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card>
            <CardTitle className="mb-4">Recent Activity</CardTitle>
            <div className="space-y-3">
              {userActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <p className="text-sm">
                    <span className="text-muted">{item.action}</span>{' '}
                    <span className="font-medium">{item.target}</span>
                  </p>
                  <span className="text-xs text-muted">{formatRelative(item.createdAt)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
