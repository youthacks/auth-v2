export default function defined<T>(
  name: string,
  value: T | null | undefined,
): T {
  if (value === null || value === undefined) {
    throw new Error(`${name} is not defined`);
  }
  return value;
}
