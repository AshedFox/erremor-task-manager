export type SearchResult<T> = {
  nodes: T[];
  totalCount: number;
};

export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type FetchResult<T> =
  | {
      data: T;
      error: null;
    }
  | { data: null; error: Error };
