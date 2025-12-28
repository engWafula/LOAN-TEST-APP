import { useMemo } from 'react';
import { LoanData } from '../../../utils/paymentStatus';
import { categorizePayment, PaymentStatus } from '../../../utils/paymentStatus';
import { PaymentStatus as PaymentStatusComponent } from '@/components/ui/PaymentStatus';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatters';
import { DataTable } from '../../loans/LoansTable/DataTable';
import { ColumnDef } from '../../loans/LoansTable/types';

interface PaymentWithStatus {
  id: number;
  loanId: number;
  paymentDate: string | null;
  status: PaymentStatus;
  dueDate: string;
}

interface ViewPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanData | null;
}

export function ViewPaymentsModal({ isOpen, onClose, loan }: ViewPaymentsModalProps) {
  const columns: ColumnDef<PaymentWithStatus>[] = useMemo(
    () => [
      {
        id: 'id',
        header: 'Payment ID',
        accessor: (row) => row.id,
        className: 'font-medium',
      },
      {
        id: 'paymentDate',
        header: 'Payment Date',
        accessor: (row) => row.paymentDate,
        cell: (value) => (value ? formatDate(value as string) : 'N/A'),
      },
      {
        id: 'dueDate',
        header: 'Due Date',
        accessor: (row) => row.dueDate,
        cell: (value) => formatDate(value as string),
      },
      {
        id: 'status',
        header: 'Status',
        accessor: (row) => row.status,
        cell: (value) => <PaymentStatusComponent status={value as PaymentStatus} />,
        align: 'center',
      },
    ],
    []
  );

  const payments = loan?.loanPayments?.filter((p) => p !== null) || [];
  const categorizedPayments: PaymentWithStatus[] = useMemo(() => {
    if (!loan) return [];
    return payments.map((payment) => ({
      ...payment,
      status: categorizePayment(loan.dueDate, payment.paymentDate) as PaymentStatus,
      dueDate: loan.dueDate,
    }));
  }, [loan, payments]);

  if (!loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Payments for {loan.name}</DialogTitle>
          <DialogDescription>
            View all payments for loan ID: {loan.id}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <DataTable
            data={categorizedPayments}
            columns={columns}
            getRowId={(row) => row.id}
            emptyTitle="No payments found"
            emptyDescription="This loan has no payments recorded yet."
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


