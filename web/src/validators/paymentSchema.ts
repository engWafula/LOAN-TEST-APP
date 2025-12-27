import { z } from 'zod';

export const paymentFormInputSchema = z.object({
  loan_id: z
    .string()
    .min(1, 'Please select a loan')
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num > 0;
      },
      {
        message: 'Please select a valid loan',
      }
    ),
  payment_date: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: 'Please enter a valid date',
      }
    ),
  amount: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: 'Amount must be a positive number',
      }
    ),
});

export const paymentFormSchema = paymentFormInputSchema.transform((data) => ({
  loan_id: parseInt(data.loan_id, 10),
  payment_date: data.payment_date || undefined,
  amount: data.amount && data.amount.trim() !== '' ? parseFloat(data.amount) : undefined,
}));

export type PaymentFormInput = z.input<typeof paymentFormInputSchema>;

export type PaymentFormData = z.output<typeof paymentFormSchema>;

