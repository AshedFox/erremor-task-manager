import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { Button, buttonVariants } from '@workspace/ui/components/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { cn } from '@workspace/ui/lib/utils';
import { format } from 'date-fns';
import { MoreVerticalIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { TaskWithInclude } from '@/types/task';

type Props = {
  task: TaskWithInclude<'tags' | 'creator'>;
};

const FullTaskCard = ({ task }: Props) => {
  return (
    <Card className="gap-8">
      <CardHeader>
        <CardTitle className="text-xl">{task.title}</CardTitle>
        <CardAction className="flex items-center gap-1">
          <Badge variant="default">
            {task.status.split('_').join(' ').toLowerCase()}
          </Badge>
          <Badge variant="outline">
            {task.priority.split('_').join(' ').toLowerCase()}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link
                  href={`/projects/${task.projectId}/tasks/${task.id}/edit`}
                >
                  <PencilIcon /> Edit task
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <p className="text-muted-foreground text-xs">Description</p>
            <p className="text-sm font-normal">{task.description}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Creator</p>
            <Link
              className="flex items-center gap-1.5"
              href={`/users/${task.creatorId}`}
            >
              <Avatar className="size-6">
                <AvatarImage src="https://i.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=1280&format=png&auto=webp&s=7177756d1f393b6e093596d06e1ba539f723264b" />
                <AvatarFallback className="text-xs bg-accent">
                  {task.creator.username
                    .split('-')
                    .slice(0, 2)
                    .map((word) => word.charAt(0).toUpperCase())
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  buttonVariants({ variant: 'link' }),
                  'text-sm font-normal p-0'
                )}
              >
                {task.creator.username}
              </span>
            </Link>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Created At</p>
            <p className="text-sm font-normal">
              {format(task.createdAt, 'PPP')}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Updated At</p>
            <p className="text-sm font-normal">
              {format(task.createdAt, 'PPP')}
            </p>
          </div>
          {task.deadline && (
            <div>
              <p className="text-muted-foreground text-xs">Deadline</p>
              <p className="text-sm font-normal">
                {format(task.deadline, 'PPP')}
              </p>
            </div>
          )}
          {task.tags.length > 0 && (
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs">Tags</p>
              <div className="flex gap-1 flex-wrap">
                {task.tags.map((tag) => (
                  <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FullTaskCard;
