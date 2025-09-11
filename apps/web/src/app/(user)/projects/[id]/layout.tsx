import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
  ArrowLeftIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  UserPenIcon,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

import ViewModeSwitch from '@/components/ViewModeSwitch';
import DeleteProjectDropdownItem from '@/features/project/DeleteProjectDropdownItem';
import LeaveProjectDropdownItem from '@/features/project/LeaveProjectDropdownItem';
import { apiFetch } from '@/lib/api-fetch.server';
import { ProjectWithInclude } from '@/types/project';
import { User } from '@/types/user';

type Props = {
  children: ReactNode;
  params: Promise<{
    id: string;
  }>;
};

const Layout = async ({ children, params }: Props) => {
  const { id } = await params;
  const user = await apiFetch<User>('/users/me', {
    next: { tags: ['current-user'] },
  });
  const project = await apiFetch<ProjectWithInclude<'participants'>>(
    `/projects/${id}?include=participants`,
    { next: { tags: [`project-${id}`] } }
  );

  const role = project.participants.find((val) => val.userId === user.id)?.role;

  if (!role) {
    redirect('/projects');
  }

  return (
    <div className="p-6 py-4 overflow-hidden flex flex-col gap-4 flex-1">
      <div className="flex items-center gap-6 overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-2"
          asChild
        >
          <Link href="/projects">
            <ArrowLeftIcon /> Back
            <span className="hidden md:inline-block"> to projects</span>
          </Link>
        </Button>
        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center gap-2 overflow-hidden">
            <div
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <h1 className="text-2xl font-bold leading-relaxed truncate">
              {project.name}
            </h1>
          </div>
        </div>
        <div className="ml-auto items-center gap-2 flex">
          <ViewModeSwitch />
          {role !== 'GUEST' && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-background dark:bg-background"
                  size="icon"
                >
                  <MoreVerticalIcon className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={8} className="w-min">
                <DropdownMenuItem asChild>
                  <Link href={`/projects/${id}/tasks/create`}>
                    <PlusIcon /> New task
                  </Link>
                </DropdownMenuItem>
                {(role === 'ADMIN' || role === 'OWNER') && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={`/projects/${id}/edit`}>
                        <PencilIcon />
                        Edit project
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/projects/${id}/participants`}>
                        <UserPenIcon />
                        Participants
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <LeaveProjectDropdownItem projectId={project.id} />
                {role === 'OWNER' && (
                  <DeleteProjectDropdownItem projectId={project.id} />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
