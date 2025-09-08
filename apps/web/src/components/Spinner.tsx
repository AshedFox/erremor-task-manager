import { cn } from '@workspace/ui/lib/utils';
import { Loader2Icon } from 'lucide-react';
import React from 'react';

type Props = {
  className?: string;
};

const Spinner = ({ className }: Props) => {
  return <Loader2Icon className={cn(className, 'animate-spin')} />;
};

export default Spinner;
