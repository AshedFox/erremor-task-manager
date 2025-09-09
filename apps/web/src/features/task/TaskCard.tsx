import { Badge } from '@workspace/ui/components/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { TaskWithInclude } from '@/types/task';

type Props = {
  task: TaskWithInclude<'tags'>;
};

const TaskCard = ({ task }: Props) => {
  return (
    <Card
      key={task.id}
      className="hover:shadow-md transition-all border-border bg-card gap-3 overflow-hidden flex-1"
    >
      <CardHeader>
        <div className="flex flex-col md:items-center md:flex-row justify-between md:gap-3 overflow-hidden">
          <Link
            href={`/projects/${task.projectId}/tasks/${task.id}`}
            className="overflow-hidden"
          >
            <CardTitle
              className="text-lg text-card-foreground truncate"
              title={task.title}
            >
              {task.title}
            </CardTitle>
          </Link>
          <div className="flex items-center gap-1">
            <Badge variant="outline">
              {task.status
                .split('_')
                .map((w) => w.charAt(0) + w.slice(1))
                .join(' ')
                .toLowerCase()}
            </Badge>
            <Badge variant="secondary">{task.priority.toLowerCase()}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {task.description}
                </p>
              )}
              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: tag.color + '20',
                        color: tag.color,
                        borderColor: tag.color + '40',
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between flex-1 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-4" />
            <span>{format(task.createdAt, 'PPP')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>{task.deadline ? format(task.deadline, 'PPP') : '-'}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
