'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@workspace/ui/lib/utils';
import React, { useState } from 'react';

import Droppable from '@/components/Droppable';
import { TASK_STATUSES } from '@/constants/task';
import { apiFetch } from '@/lib/api-fetch.client';
import { Task, TaskStatus, TaskWithInclude } from '@/types/task';

import TaskCard from './TaskCard';
import TasksKanbanColumn from './TasksKanbanColumn';

type Props = {
  projectId: string;
};

const TasksKanban = ({ projectId }: Props) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (task: Task & { oldStatus: TaskStatus }) =>
      apiFetch(`/tasks/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: task.status,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    onSuccess: (_data, { status, oldStatus }) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', { projectId, status, viewMode: 'kanban' }],
      });
      queryClient.invalidateQueries({
        queryKey: [
          'tasks',
          { projectId, status: oldStatus, viewMode: 'kanban' },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks', { projectId, viewMode: 'list' }],
      });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 10,
      },
    })
  );

  const [activeTask, setActiveTask] = useState<TaskWithInclude<'tags'>>();
  const [overId, setOverId] = useState<string>();

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(event.active.data.current as TaskWithInclude<'tags'>);
  }

  function handleDragOver(event: DragOverEvent) {
    setOverId(event.over?.id as string | undefined);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setOverId(undefined);
    setActiveTask(undefined);

    if (!over) {
      return;
    }

    const task = active.data.current as Task;

    if (task.status === over.id) {
      return;
    }

    mutate({
      ...task,
      status: over.id as TaskStatus,
      oldStatus: task.status,
    });
  }

  return (
    <DndContext
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="flex flex-col flex-1">
        <div className="flex p-4 gap-4 overflow-x-auto flex-1">
          {TASK_STATUSES.map((status) => (
            <Droppable
              className={cn(
                'flex shrink-0',
                overId === status && 'outline-3 rounded-xl outline-primary'
              )}
              key={status}
              id={status}
            >
              <TasksKanbanColumn status={status} projectId={projectId} />
            </Droppable>
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TasksKanban;
