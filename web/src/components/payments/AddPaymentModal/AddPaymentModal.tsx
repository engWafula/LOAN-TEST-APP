import { useState, FormEvent } from 'react';
import { addPayment } from '../../../utils/api';
import { LoanData } from '../../../utils/paymentStatus';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { FormField } from '@/components/ui/FormField';
import { EmptyState } from '@/components/ui/EmptyState';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentAdded?: () => void;
  loans: LoanData[];
}

export function AddPaymentModal({ isOpen, onClose, onPaymentAdded, loans }: AddPaymentModalProps) {
  const [loanId, setLoanId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const loanIdNum = parseInt(loanId, 10);
      if (!loanId || isNaN(loanIdNum) || loanIdNum < 1) {
        throw new Error('Please select a loan');
      }

      await addPayment({
        loan_id: loanIdNum,
        payment_date: paymentDate || undefined,
        amount: amount ? parseFloat(amount) : undefined,
      });

      setSuccess(true);
      setLoanId('');
      setPaymentDate('');
      setAmount('');

      if (onPaymentAdded) {
        onPaymentAdded();
      }

        setSuccess(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      setSuccess(false);
      setLoanId('');
      setPaymentDate('');
      setAmount('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
          <DialogDescription>
            Record a payment for an existing loan.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Payment added successfully!</AlertDescription>
          </Alert>
        )}

        {loans.length === 0 ? (
          <EmptyState
            title="No loans available"
            description="There are no loans available to add payments to."
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Select Loan" htmlFor="loan-select" required>
              <FormSelect
                id="loan-select"
                value={loanId}
                onValueChange={setLoanId}
                disabled={isSubmitting}
                required
                placeholder="-- Select a loan --"
                options={loans.map((loan) => ({
                  value: loan.id.toString(),
                  label: `${loan.name} (ID: ${loan.id}) - ${formatCurrency(loan.principal)}`,
                }))}
              />
            </FormField>

            <FormField label="Payment Date" htmlFor="payment-date" optional>
              <FormInput
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label="Amount" htmlFor="amount" optional>
              <FormInput
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <SubmitButton
                type="submit"
                loading={isSubmitting}
                loadingText="Adding..."
              >
                Add Payment
              </SubmitButton>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
