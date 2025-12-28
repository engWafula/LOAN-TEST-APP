import { differenceInDays, parseISO, isValid } from 'date-fns';

export type PaymentStatus = 'On Time' | 'Late' | 'Defaulted' | 'Unpaid';

export interface CategorizedPayment {
  id: number;
  name: string;
  interestRate: number;
  principal: number;
  dueDate: string;
  paymentDate: string | null;
  status: PaymentStatus;
}

export interface LoanData {
  id: number;
  name: string;
  interestRate: number;
  principal: number;
  dueDate: string;
  loanPayments?: Array<{
    id: number;
    loanId: number;
    paymentDate: string | null;
  } | null> | null;
}

export function categorizePayment(
  dueDate: string,
  paymentDate: string | null
): PaymentStatus {
  if (!paymentDate) return 'Unpaid';

  const due = parseISO(dueDate);
  const payment = parseISO(paymentDate);
  
  if (!isValid(due) || !isValid(payment)) return 'Unpaid';

  const diffDays = differenceInDays(payment, due);
  
  return diffDays <= 5 ? 'On Time' 
       : diffDays <= 30 ? 'Late' 
       : 'Defaulted';
}

export function getLoanStatus(loan: LoanData): PaymentStatus {
  const validPayments = loan.loanPayments
    ?.filter((p): p is NonNullable<typeof p> => p !== null && p.paymentDate !== null) || [];
  
  if (validPayments.length === 0) return 'Unpaid';
  
  const mostRecent = validPayments.reduce((latest, current) => 
    current.paymentDate! > latest.paymentDate! ? current : latest
  );
  
  return categorizePayment(loan.dueDate, mostRecent.paymentDate);
}

export function categorizeLoanPayments(
  loans: LoanData[]
): CategorizedPayment[] {
  const categorized: CategorizedPayment[] = [];

  for (const loan of loans) {
    const payments = loan.loanPayments?.filter((p): p is NonNullable<typeof p> => p !== null) || [];
    
    if (payments.length === 0) {
      categorized.push({
        id: loan.id,
        name: loan.name,
        interestRate: loan.interestRate,
        principal: loan.principal,
        dueDate: loan.dueDate,
        paymentDate: null,
        status: 'Unpaid',
      });
    } else {
      for (const payment of payments) {
        categorized.push({
          id: loan.id,
          name: loan.name,
          interestRate: loan.interestRate,
          principal: loan.principal,
          dueDate: loan.dueDate,
          paymentDate: payment.paymentDate,
          status: categorizePayment(loan.dueDate, payment.paymentDate),
        });
      }
    }
  }

  return categorized;
}

