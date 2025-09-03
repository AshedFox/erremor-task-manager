import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

type Props = {
  id: string;
  className?: string;
  children: ReactNode;
  data?: any;
};

const Draggable = ({ id, className, children, data }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      className={className}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};

export default Draggable;
