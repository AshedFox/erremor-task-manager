import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

type Props = {
  id: string;
  className?: string;
  children: ReactNode;
};

const Droppable = ({ id, className, children }: Props) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
};

export default Droppable;
