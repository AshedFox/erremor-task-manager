'use client';

import { Button } from '@workspace/ui/components/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { FileIcon, MusicIcon, VideoIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import React, { ChangeEvent } from 'react';
import { ControllerFieldState } from 'react-hook-form';

import Spinner from '@/components/Spinner';
import { FileType } from '@/types/file';

type ApiFile = {
  id: string;
  name: string;
  type: FileType;
  url: string;
  size: number;
};

type FileUploaderProps = {
  fieldState: ControllerFieldState;
  isLoading: boolean;
  onUpload: (file: File) => void;
  onRemove: (id: string) => void;
  files?: ApiFile[];
  title?: string;
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
        <div className="flex flex-col gap-2 overflow-hidden">
          {files.map((file) => (
            <div
              className="grid grid-flow-col grid-cols-[auto_1fr] items-center gap-4 overflow-hidden max-w-full border p-4 pr-8 rounded-lg relative"
              key={file.id}
            >
              {file.type === 'IMAGE' ? (
                <div className="relative size-16 overflow-hidden rounded-lg">
                  <Image
                    className={'object-cover'}
                    src={file.url}
                    alt={file.name}
                    fill
                  />
                </div>
              ) : file.type === 'VIDEO' ? (
                <VideoIcon className="size-8" />
              ) : file.type === 'AUDIO' ? (
                <MusicIcon className="size-8" />
              ) : (
                <FileIcon className="size-8" />
              )}
              <div className="flex flex-col gap-1 overflow-hidden">
                <h3 title={file.name} className="font-semibold truncate">
                  <a href={file.url} target="_blank" rel="noreferrer">
                    {file.name}
                  </a>
                </h3>
                <span className="text-muted-foreground text-sm">
                  {Math.round(file.size / 1024)} KB
                </span>
              </div>
              <Button
                className="right-1 top-1 absolute"
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(file.id)}
              >
                <XIcon />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Field>
  );
};

export default FileUploader;
