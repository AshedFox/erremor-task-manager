export function mapInclude<T extends string>(
  include?: T[]
): Record<T, true> | undefined {
  if (!include || !(include instanceof Array) || include.length === 0) {
    return undefined;
  }
  return include.reduce(
    (acc, field) => {
      acc[field] = true;
      return acc;
    },
    {} as Record<T, true>
  );
}
