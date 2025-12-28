import { LoanData } from '../../../utils/paymentStatus';
import { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessor: (row: T) => unknown;
  cell?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
}

export interface SortState {
  field: string | null;
  direction: SortDirection;
}

export type LoansTableColumn = ColumnDef<LoanData>;

