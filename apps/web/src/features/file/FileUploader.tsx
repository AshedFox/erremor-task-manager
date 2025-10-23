'use client';

import { Button } from '@workspace/ui/components/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { FileIcon, XIcon } from 'lucide-react';
import React, { ChangeEvent, ComponentType } from 'react';
import { ControllerFieldState } from 'react-hook-form';

import Spinner from '@/components/Spinner';
import { File as ApiFile, FileType } from '@/types/file';

import AudioPreview from './AudioPreview';
import FilePreview from './FilePreview';
import ImagePreview from './ImagePreview';
import VideoPreview from './VideoPreview';

type FileUploaderProps = {
  fieldState: ControllerFieldState;
  isLoading: boolean;
  onUpload: (file: File) => void;
  onRemove: (id: string) => void;
  files?: ApiFile[];
  title?: string;
};

const previews: Record<FileType, ComponentType<{ file: ApiFile }>> = {
  IMAGE: ImagePreview,
  VIDEO: VideoPreview,
  AUDIO: AudioPreview,
  FILE: FilePreview,
  VOICE: AudioPreview,
};

const FileUploader = ({
  files,
  fieldState,
  isLoading,
  onUpload,
  onRemove,
  title = 'Files',
}: FileUploaderProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    onUpload(e.target.files.item(0)!);
  };

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldContent>
        <FieldLabel>{title}</FieldLabel>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner /> Uploading
            </>
          ) : (
            <>
              <FileIcon /> Upload files
            </>
          )}
        </Button>
        <Input
          disabled={isLoading}
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </FieldContent>

      {files && files.length > 0 && (
        <div className="space-y-4">
          {files.map((file) => {
            const Preview = previews[file.type];
            return (
              <div
                key={file.id}
                className="grid grid-cols-[1fr_auto] gap-2 p-4 rounded-lg border bg-card"
              >
                <Preview file={file} />
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => onRemove(file.id)}
                >
                  <XIcon />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Field>
  );
};

export default FileUploader;
