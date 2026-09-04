export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export function normalizePagination(input: { limit?: number; cursor?: string }) {
  const limit = Math.min(Math.max(input.limit ?? 50, 1), 500);
  return { limit, cursor: input.cursor };
}
