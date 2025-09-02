export type OffsetPagination = {
  take: number;
  skip: number;
};

export type CursorPagination = {
  take: number;
  cursor?: string;
};

export type Pagination =
  | (CursorPagination & { skip?: never })
  | (OffsetPagination & { cursor?: never });
