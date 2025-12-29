import { format } from 'date-fns';


export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}


export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch {
    return 'N/A';
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

