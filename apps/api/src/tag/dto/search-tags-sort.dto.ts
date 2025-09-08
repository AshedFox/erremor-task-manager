import { Tag } from '@prisma/client';

import { createSortDtoFactory } from '@/common/sort';

export class SearchTagsSortDto extends createSortDtoFactory<Tag>()(['name']) {}
