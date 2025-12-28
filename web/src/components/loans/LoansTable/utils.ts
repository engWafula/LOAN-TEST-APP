import { SortState } from './types';

export function sortData<T>(
  data: T[],
  sortState: SortState,
  accessor: (row: T) => unknown
): T[] {
  if (!sortState.field || !sortState.direction) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aValue = accessor(a);
    const bValue = accessor(b);

    // Handle null/undefined values
    if (aValue === null || aValue === undefined || aValue === '') return 1;
    if (bValue === null || bValue === undefined || bValue === '') return -1;

    // String comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      return sortState.direction === 'asc' ? comparison : -comparison;
    }

    // Number comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
}

export function toggleSort(
  currentSort: SortState,
  field: string
): SortState {
  if (currentSort.field === field) {
    if (currentSort.direction === 'asc') {
      return { field, direction: 'desc' };
    } else if (currentSort.direction === 'desc') {
      return { field: null, direction: null };
    } else {
      return { field, direction: 'asc' };
    }
  }
  return { field, direction: 'asc' };
}

