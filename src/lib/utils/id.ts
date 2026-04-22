let counter = 0;

export function createId(prefix: string) {
  counter += 1;
  return `${prefix}_${counter.toString(36).padStart(4, "0")}`;
}
