import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface LoanCalculatorProps {
  principal: number;
  rate: number;
  months: number;
}

function calculateInterest(principal: number, rate: number, months: number): number {
  if (principal > 0 && rate >= 0 && months > 0) {
    return (principal * rate * months) / 100;
  }
  return 0;
}

export function LoanCalculator({ principal, rate, months }: LoanCalculatorProps) {
  const interest = calculateInterest(principal, rate, months);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-muted-foreground">Principal</TableCell>
            <TableCell className="text-right font-semibold">
              {formatCurrency(principal)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-muted-foreground">Interest Rate</TableCell>
            <TableCell className="text-right font-semibold">{rate}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-muted-foreground">Duration</TableCell>
            <TableCell className="text-right font-semibold">{months} months</TableCell>
          </TableRow>
          <TableRow className="border-t-2">
            <TableCell className="font-medium">Total Interest</TableCell>
            <TableCell className="text-right font-bold text-primary text-lg">
              {formatCurrency(interest)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
