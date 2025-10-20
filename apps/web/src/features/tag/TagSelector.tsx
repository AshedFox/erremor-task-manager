import { Field, FieldLabel } from '@workspace/ui/components/field';
import MultipleSelector, {
  Option,
} from '@workspace/ui/components/multiple-selector';
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';

import Spinner from '@/components/Spinner';
import { apiFetch } from '@/lib/api-fetch.client';
import { SearchResult } from '@/types/common';
import { Tag } from '@/types/tag';

type TagSelectorProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
  onTagCreate: (name: string) => Promise<{ id: string; name: string }>;
  onChange: (options: Option[]) => void;
  searchDelay?: number;
  title?: string;
};

const TagSelector = <T extends FieldValues>({
  field,
  fieldState,
  onTagCreate,
  onChange,
  searchDelay = 300,
  title = 'Tags',
}: TagSelectorProps<T>) => {
  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>{title}</FieldLabel>
      <MultipleSelector
        {...field}
        minLength={2}
        maxLength={48}
        placeholder="Select tags for task"
        delay={searchDelay}
        onSearch={async (query) => {
          const { nodes } = await apiFetch<SearchResult<Tag>>(
            `/tags?name=${query}`
          );
          return nodes.map((tag) => ({
            value: tag.id,
            label: tag.name,
          }));
        }}
        creatable
        createOption={async (value) => {
          const tag = await onTagCreate(value);
          return { value: tag.id, label: tag.name };
        }}
        onChange={onChange}
        loadingIndicator={
          <div className="flex items-center justify-center p-4">
            <Spinner className="size-6" /> Loading...
          </div>
        }
        creatingIndicator={
          <div className="flex items-center justify-center p-4">
            <Spinner className="size-6" /> Creating...
          </div>
        }
        emptyIndicator={
          <div className="flex items-center justify-center p-4 text-sm font-normal text-muted-foreground">
            Nothing found...
          </div>
        }
        maxSelected={8}
      />
    </Field>
  );
};

export default TagSelector;
