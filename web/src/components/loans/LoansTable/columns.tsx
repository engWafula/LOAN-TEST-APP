import { LoansTableColumn } from './types';
import { LoanData, getLoanStatus, PaymentStatus } from '../../../utils/paymentStatus';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { PaymentStatus as PaymentStatusComponent } from '@/components/ui/PaymentStatus';
import { Eye } from 'lucide-react';

export const createLoansTableColumns = (
  onViewPayments?: (loan: LoanData) => void
): LoansTableColumn[] => [
  {
    id: 'name',
    header: 'Loan Name',
    accessor: (row) => row.name,
    sortable: true,
    className: 'font-medium',
  },
  {
    id: 'id',
    header: 'Loan ID',
    accessor: (row) => row.id,
    sortable: true,
    className: 'text-muted-foreground',
  },
  {
    id: 'principal',
    header: 'Principal',
    accessor: (row) => row.principal,
    cell: (value) => formatCurrency(value as number),
    sortable: true,
    align: 'right',
    className: 'font-semibold',
  },
  {
    id: 'interestRate',
    header: 'Interest Rate',
    accessor: (row) => row.interestRate,
    cell: (value) => `${value}%`,
    sortable: true,
    align: 'right',
  },
  {
    id: 'dueDate',
    header: 'Due Date',
    accessor: (row) => row.dueDate,
    cell: (value) => formatDate(value as string),
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => getLoanStatus(row),
    cell: (value) => <PaymentStatusComponent status={value as PaymentStatus} />,
    sortable: true,
    align: 'center',
  },
  {
    id: 'actions',
    header: 'Actions',
    accessor: () => null,
    cell: (_, row) => {
      const loan = row as LoanData;
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (onViewPayments) {
              onViewPayments(loan);
            } else {
              const event = new CustomEvent('viewPayments', { detail: { loan } });
              window.dispatchEvent(event);
            }
          }}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Payments
        </Button>
      );
    },
    sortable: false,
    align: 'center',
  },
];

export const loansTableColumns = createLoansTableColumns();
