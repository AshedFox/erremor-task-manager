export type SearchResult<T> = {
  nodes: T[];
  totalCount: number;
};

export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export class ApiFetchError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'FetchError';
    Object.setPrototypeOf(this, ApiFetchError.prototype);
  }
}

export type FetchResult<T> =
  | {
      data: T;
      error: null;
    }
  | { data: null; error: ApiFetchError };

export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type PaginationMeta = {
  totalCount?: number;
  limit: number;
  currentPage?: number;
  totalPages?: number;
  hasNext: boolean;
  nextCursor?: string;
};
