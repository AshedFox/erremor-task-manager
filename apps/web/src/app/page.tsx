import { Button } from '@workspace/ui/components/button';
import { ArrowRightIcon, LogInIcon } from 'lucide-react';
import Link from 'next/link';

import { apiFetchSafe } from '@/lib/api-fetch.server';
import { User } from '@/types/user';

export default async function Page() {
  const { data: user } = await apiFetchSafe<User>('/users/me');

  return (
    <div className="flex px-10 py-4 flex-1 bg-linear-140 from-primary/15 to-primary/60">
      <div className="m-auto flex flex-col items-center justify-center gap-6 max-w-3xl">
        <h1 className="text-5xl md:text-6xl xl:text-8xl font-extrabold text-center">
          Welcome to Erremore!
        </h1>
        <p className="md:text-lg xl:text-xl text-muted-foreground text-center">
          Enjoy our cool task manager. Keep all your tasks organized and
          accessible from anywhere.
        </p>
        <Button variant="secondary" size="lg" asChild>
          {user ? (
            <Link href="/projects">
              Go to your projects
              <ArrowRightIcon />
            </Link>
          ) : (
            <Link href="/login">
              Get started
              <LogInIcon />
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
}
