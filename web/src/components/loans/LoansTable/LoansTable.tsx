import { useState, useMemo, useEffect } from 'react';
import { CategorizedPayment } from '../../../utils/paymentStatus';
import { DataTable } from './DataTable';
import { TablePagination } from './TablePagination';
import { loansTableColumns } from './columns';
import { SortState, PaginationState } from './types';
import { sortData, paginateData, getPageNumbers, toggleSort } from './utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface LoansTableProps {
  payments: CategorizedPayment[];
  itemsPerPage?: number;
  onAddPaymentClick?: () => void;
}

export function LoansTable({ payments, itemsPerPage = 20, onAddPaymentClick }: LoansTableProps) {
  const [sortState, setSortState] = useState<SortState>({
    field: 'id',
    direction: 'asc',
  });
  const [paginationState, setPaginationState] = useState<PaginationState>({
    page: 1,
    pageSize: itemsPerPage,
  });

  const handleSort = (field: string) => {
    const newSortState = toggleSort(sortState, field);
    setSortState(newSortState);
    setPaginationState((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPaginationState((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPaginationState({ page: 1, pageSize });
  };

  // Find the column definition for sorting
  const getColumnAccessor = (field: string) => {
    const column = loansTableColumns.find((col) => col.id === field);
    return column?.accessor || (() => null);
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortState.field) return payments;
    const accessor = getColumnAccessor(sortState.field);
    return sortData(payments, sortState, accessor);
  }, [payments, sortState]);

  // Paginate data
  const { paginatedData, totalPages, startIndex, endIndex } = useMemo(
    () => paginateData(sortedData, paginationState.page, paginationState.pageSize),
    [sortedData, paginationState.page, paginationState.pageSize]
  );

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (paginationState.page > totalPages && totalPages > 0) {
      setPaginationState((prev) => ({ ...prev, page: 1 }));
    }
  }, [totalPages, paginationState.page]);

  const pageNumbers = getPageNumbers(paginationState.page, totalPages);

  const getRowId = (row: CategorizedPayment) => `${row.id}-${row.paymentDate || 'unpaid'}`;

  if (payments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Loans & Payments</h2>
          {onAddPaymentClick && (
            <Button onClick={onAddPaymentClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
            </Button>
          )}
        </div>
        <EmptyState
          title="No loans found"
          description="There are no loans to display at this time."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Loans & Payments</h2>
        {onAddPaymentClick && (
          <Button onClick={onAddPaymentClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Button>
        )}
      </div>

      <DataTable
        data={paginatedData}
        columns={loansTableColumns}
        sortState={sortState}
        onSort={handleSort}
        getRowId={getRowId}
        emptyTitle="No data available"
        emptyDescription="Try adjusting your filters or search criteria."
      />

      <TablePagination
        currentPage={paginationState.page}
        totalPages={totalPages}
        pageSize={paginationState.pageSize}
        totalItems={sortedData.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageNumbers={pageNumbers}
      />
    </div>
  );
}
