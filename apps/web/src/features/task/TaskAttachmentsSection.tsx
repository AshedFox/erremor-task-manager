import { Badge } from '@workspace/ui/components/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  AudioWaveformIcon,
  FilesIcon,
  ImageIcon,
  PaperclipIcon,
  VideoIcon,
} from 'lucide-react';
import React from 'react';

import { File, FileType } from '@/types/file';

import AudioPreview from '../file/AudioPreview';
import FilePreview from '../file/FilePreview';
import ImagePreview from '../file/ImagePreview';
import VideoPreview from '../file/VideoPreview';

type Props = {
  files: File[];
};

type AttachmentSection = {
  type: FileType;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  grid: boolean;
  Preview: React.ComponentType<{ file: File }>;
};

const ATTACHMENTS_SECTIONS: readonly AttachmentSection[] = [
  {
    type: 'IMAGE',
    title: 'Images',
    icon: ImageIcon,
    grid: true,
    Preview: ImagePreview,
  },

  {
    type: 'VIDEO',
    title: 'Videos',
    icon: VideoIcon,
    grid: false,
    Preview: VideoPreview,
  },
  {
    type: 'AUDIO',
    title: 'Audios',
    icon: AudioWaveformIcon,
    grid: false,
    Preview: AudioPreview,
  },
  {
    type: 'FILE',
    title: 'Files',
    icon: FilesIcon,
    grid: false,
    Preview: FilePreview,
  },
];

function groupFilesByType(files: File[]) {
  const groups: Record<FileType, File[]> = {
    IMAGE: [],
    VIDEO: [],
    AUDIO: [],
    FILE: [],
    VOICE: [],
  };

  for (const file of files) {
    groups[file.type].push(file);
  }

  return groups;
}

const TaskAttachmentsSection = ({ files }: Props) => {
  const filesByType = groupFilesByType(files);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PaperclipIcon className="size-4" />
          Attachments
          <Badge variant="outline">{files.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 @container">
        {ATTACHMENTS_SECTIONS.map(
          ({ title, icon: Icon, grid, Preview, type }) => {
            const files = filesByType[type];

            return (
              files.length > 0 && (
                <div key={type} className="space-y-3">
                  <h4 className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Icon className="size-4" />
                    {title} ({files.length})
                  </h4>
                  <div
                    className={
                      grid
                        ? 'grid grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 gap-4'
                        : 'space-y-6'
                    }
                  >
                    {files.map((file) => (
                      <Preview key={file.id} file={file} />
                    ))}
                  </div>
                </div>
              )
            );
          }
        )}
      </CardContent>
    </Card>
  );
};

export default TaskAttachmentsSection;
