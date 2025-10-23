import { MusicIcon } from 'lucide-react';
import React from 'react';

import { formatFileSize } from '@/lib/utils';
import { File } from '@/types/file';

type Props = {
  file: File;
};

const AudioPreview = ({ file }: Props) => {
  return (
    <div className="space-y-2 rounded-lg border bg-muted overflow-hidden p-4">
      <div className="flex items-center gap-2">
        <div className="border border-primary text-primary rounded-lg bg-primary/20 size-10 flex items-center justify-center shrink-0">
          <MusicIcon className="size-4" />
        </div>
        <div className="space-y-1 overflow-hidden">
          <p className="text-sm truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
      <audio controls className="w-full " preload="metadata">
        <source src={file.url} />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};

export default AudioPreview;
