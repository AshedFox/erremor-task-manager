import React from 'react';

import { formatFileSize } from '@/lib/utils';
import { File } from '@/types/file';

type Props = {
  file: File;
};

const VideoPreview = ({ file }: Props) => {
  return (
    <div className="space-y-2">
      <div className="rounded-lg border overflow-hidden bg-muted">
        <video controls className="w-full" preload="metadata">
          <source src={file.url} />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm truncate">{file.name}</span>
        <span className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </span>
      </div>
    </div>
  );
};

export default VideoPreview;
