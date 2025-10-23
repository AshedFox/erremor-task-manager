import { Button } from '@workspace/ui/components/button';
import { DownloadIcon, FileIcon } from 'lucide-react';
import React from 'react';

import { formatFileSize } from '@/lib/utils';
import { File } from '@/types/file';

type Props = {
  file: File;
};

const FilePreview = ({ file }: Props) => {
  return (
    <div className="space-y-2 rounded-lg border bg-muted overflow-hidden p-4">
      <div className="flex items-center gap-2">
        <div className="border border-secondary text-muted-foreground rounded-lg bg-secondary/30 size-10 flex items-center justify-center shrink-0">
          <FileIcon className="size-4" />
        </div>
        <div className="space-y-1 overflow-hidden">
          <p className="text-sm truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
        <Button className="ml-auto" size="icon-sm" variant="ghost" asChild>
          <a href={file.url} target="_blank" rel="noreferrer">
            <DownloadIcon />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default FilePreview;
