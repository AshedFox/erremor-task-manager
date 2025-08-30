import { User } from '@prisma/client';

export class SearchUsersResponseDto {
  nodes!: User[];
  totalCount!: number;
}
