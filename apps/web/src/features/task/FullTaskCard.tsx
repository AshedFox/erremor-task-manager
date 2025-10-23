import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
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
import { format } from 'date-fns';
import { MoreVerticalIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { TaskWithInclude } from '@/types/task';

import DeleteTaskDropdownItem from './DeleteTaskDropdownItem';
import TaskAttachmentsSection from './TaskAttachmentsSection';

type Props = {
  task: TaskWithInclude<'tags' | 'creator' | 'files'>;
};

const FullTaskCard = ({ task }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-4 @container">
      <div className="col-span-3 @lg:col-span-2 space-y-6">
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
                  <DeleteTaskDropdownItem
                    taskId={task.id}
                    projectId={task.projectId}
                  />
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
              {task.tags.length > 0 && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs">Tags</p>
                  <div className="flex gap-1 flex-wrap">
                    {task.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {task.files.length > 0 && <TaskAttachmentsSection files={task.files} />}
      </div>
      <div className="space-y-6 col-span-3 @lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
          </CardHeader>
          <CardContent className="@container">
            <div className="grid @sm:grid-cols-2 gap-4 overflow-hidden">
              <div className="@sm:col-span-2">
                <p className="text-muted-foreground text-xs">Creator</p>
                <Link
                  className={
                    'text-primary underline-offset-4 hover:underline text-sm font-normal'
                  }
                  href={`/users/${task.creatorId}`}
                >
                  {task.creator.username}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FullTaskCard;
