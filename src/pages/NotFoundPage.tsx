import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-ink bg-yellow/30 text-5xl font-extrabold text-ink shadow-brutal-lg mb-8">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-ink">Page not found</h1>
        <p className="text-muted mt-3 text-base leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex justify-center gap-3 mt-10">
          <Link to={ROUTES.LANDING}>
            <Button variant="dark">
              <Home className="h-4 w-4" /> Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
