export function mapInclude<T extends string>(
  include?: T[]
): Record<T, true> | undefined {
  if (!(include instanceof Array)) {
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
