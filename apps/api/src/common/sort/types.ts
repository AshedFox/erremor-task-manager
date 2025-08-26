export type Sort<T, K extends keyof T = keyof T> = {
  sortBy?: K;
  sortOrder?: 'asc' | 'desc';
};
