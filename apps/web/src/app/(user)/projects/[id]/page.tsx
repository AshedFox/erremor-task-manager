import TasksKanbanPreloader from '@/features/task/TasksKanbanPreloader';
import TasksListPreloader from '@/features/task/TasksListPreloader';

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    viewMode?: string;
  }>;
};

const Page = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const { viewMode } = await searchParams;

  return viewMode === 'kanban' ? (
    <TasksKanbanPreloader projectId={id} />
  ) : (
    <TasksListPreloader projectId={id} />
  );
};

export default Page;
