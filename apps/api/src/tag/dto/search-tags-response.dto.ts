import { Tag } from '@prisma/client';

export class SearchTagsResponseDto {
  nodes!: Tag[];
  totalCount!: number;
}
