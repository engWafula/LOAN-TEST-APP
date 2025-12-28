import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ColumnDef, SortState } from './types';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  sortState?: SortState;
  onSort?: (field: string) => void;
  getRowId: (row: T) => string | number;
  emptyMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

function SortIcon({ field, sortState }: { field: string; sortState?: SortState }) {
  if (!sortState || sortState.field !== field) {
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
  }
  if (sortState.direction === 'asc') {
    return <ArrowUp className="ml-2 h-4 w-4" />;
  }
  if (sortState.direction === 'desc') {
    return <ArrowDown className="ml-2 h-4 w-4" />;
  }
  return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
}

export function DataTable<T>({
  data,
  columns,
  sortState,
  onSort,
  getRowId,
  emptyMessage = 'No data available',
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  column.align === 'right' && 'text-right',
                  column.align === 'center' && 'text-center',
                  column.headerClassName
                )}
              >
                {column.sortable && onSort ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 hover:bg-transparent"
                    onClick={() => onSort(column.id)}
                  >
                    {column.header}
                    <SortIcon field={column.id} sortState={sortState} />
                  </Button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={getRowId(row)}>
              {columns.map((column) => {
                const value = column.accessor(row);
                const cellContent = column.cell ? column.cell(value, row) : String(value ?? '');

                return (
                  <TableCell
                    key={column.id}
                    className={cn(
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center',
                      column.className
                    )}
                  >
                    {cellContent}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
