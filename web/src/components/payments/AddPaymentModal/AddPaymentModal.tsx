import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addPayment } from '../../../utils/api';
import { LoanData } from '../../../utils/paymentStatus';
import { paymentFormInputSchema, type PaymentFormInput } from '../../../validators/paymentSchema';
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PaymentFormInput>({
    resolver: zodResolver(paymentFormInputSchema),
    defaultValues: {
      loan_id: '',
      payment_date: '',
      amount: '',
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: PaymentFormInput) => {
    setError(null);
    setSuccess(false);

    try {
      // Transform form data to API format
      const loanIdNum = parseInt(data.loan_id, 10);
      const amountNum = data.amount && data.amount.trim() !== '' ? parseFloat(data.amount) : undefined;

      await addPayment({
        loan_id: loanIdNum,
        payment_date: data.payment_date || undefined,
        amount: amountNum,
      });

      setSuccess(true);
      reset();

      if (onPaymentAdded) {
        onPaymentAdded();
      }

      // Auto-close after success
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setError(null);
      setSuccess(false);
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              label="Select Loan"
              htmlFor="loan_id"
              required
              error={errors.loan_id?.message}
            >
              <Controller
                name="loan_id"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    id="loan_id"
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                    required
                    error={!!errors.loan_id}
                    placeholder="-- Select a loan --"
                    options={loans.map((loan) => ({
                      value: loan.id.toString(),
                      label: `${loan.name} (ID: ${loan.id}) - ${formatCurrency(loan.principal)}`,
                    }))}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Payment Date"
              htmlFor="payment_date"
              optional
              error={errors.payment_date?.message}
            >
              <FormInput
                id="payment_date"
                type="date"
                {...register('payment_date')}
                disabled={isSubmitting}
                error={!!errors.payment_date}
              />
            </FormField>

            <FormField
              label="Amount"
              htmlFor="amount"
              optional
              error={errors.amount?.message}
            >
              <FormInput
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('amount')}
                disabled={isSubmitting}
                error={!!errors.amount}
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
