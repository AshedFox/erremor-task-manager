export type Include<T, K extends keyof T = keyof T> = {
  include?: K[];
};
