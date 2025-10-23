import { EyeIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { formatFileSize } from '@/lib/utils';
import { File } from '@/types/file';

type Props = {
  file: File;
};

const ImagePreview = ({ file }: Props) => {
  return (
    <div className="space-y-2">
      <div className="relative group overflow-hidden rounded-lg border bg-muted aspect-video cursor-pointer">
        <Image
          className="object-cover group-hover:scale-105 transition-transform"
          src={file.url}
          alt={file.name}
          fill
        />
        <a
          href={file.url}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <EyeIcon className="size-8 " />
        </a>
      </div>
      <div className="space-y-1">
        <p className="text-sm truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
      </div>
    </div>
  );
};

export default ImagePreview;
