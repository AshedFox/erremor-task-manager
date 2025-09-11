import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { BarChart3, MoreVerticalIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { ProjectWithInclude } from '@/types/project';
import { User } from '@/types/user';

import DeleteProjectDropdownItem from './DeleteProjectDropdownItem';
import LeaveProjectDropdownItem from './LeaveProjectDropdownItem';

type Props = {
  project: ProjectWithInclude<'tasks' | 'participants'>;
  user: User;
};

const ProjectCard = ({ project, user }: Props) => {
  const { id, name, description, status, color, tasks } = project;

  const progress = useMemo(
    () =>
      tasks.length > 0
        ? Math.round(
            (tasks.filter(({ status }) => status === 'DONE').length /
              tasks.length) *
              100
          )
        : 0,
    [tasks]
  );

  const userRole = useMemo(
    () => project.participants.find((value) => value.userId === user.id)?.role,
    [project.participants, user.id]
  );

  return (
    <Card className="hover:shadow-lg transition-all border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2 overflow-hidden">
          <div
            className="size-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <Link href={`/projects/${id}`} className="overflow-hidden">
            <CardTitle
              className="text-lg text-card-foreground truncate"
              title={name}
            >
              {name}
            </CardTitle>
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CardAction>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon />
              </Button>
            </CardAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-min">
            {(userRole === 'ADMIN' || userRole === 'OWNER') && (
              <DropdownMenuItem asChild>
                <Link href={`/projects/${id}/edit`}>
                  <PencilIcon />
                  Edit project
                </Link>
              </DropdownMenuItem>
            )}
            <LeaveProjectDropdownItem projectId={project.id} />
            {userRole === 'OWNER' && (
              <DeleteProjectDropdownItem projectId={project.id} />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {description && (
          <CardDescription className="text-muted-foreground line-clamp-3">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3 mt-auto">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-1 text-sm text-muted-foreground justify-self-end">
            <BarChart3 className="size-4" />
            <span>{tasks.length} tasks</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {progress}% complete
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center">
          <Badge className="ml-auto" variant="outline">
            {status.toLowerCase()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
