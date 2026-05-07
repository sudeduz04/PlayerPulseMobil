import type { Paginated } from '@/src/api/types';

/**
 * Backend may wrap responses in two shapes depending on the controller:
 *   { success: true, data: <payload> }
 *   <payload>  (raw)
 * For paginated lists, <payload> is itself { data: [...], meta?, links? }.
 * These helpers normalize both shapes so the rest of the app can treat them uniformly.
 */

export function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'success' in (payload as object) && 'data' in (payload as object)) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export function unwrapPaginated<T>(payload: unknown): Paginated<T> {
  const inner = unwrap<unknown>(payload);
  if (Array.isArray(inner)) {
    return { data: inner as T[] };
  }
  if (inner && typeof inner === 'object' && 'data' in (inner as object)) {
    return inner as Paginated<T>;
  }
  return { data: [] };
}
