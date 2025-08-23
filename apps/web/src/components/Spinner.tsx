import { cn } from '@workspace/ui/lib/utils';
import { CircleGaugeIcon } from 'lucide-react';
import React from 'react';

type Props = {
  className?: string;
};

const Spinner = ({ className }: Props) => {
  return <CircleGaugeIcon className={cn(className, 'animate-spin')} />;
};

export default Spinner;
