import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface CreditHistoryEntry {
  type: string;
  description: string;
  value: number;
  created_at: string;
}

interface CreditHistoryProps {
  history: CreditHistoryEntry[];
  isLoading: boolean;
}

export function CreditHistory({ history, isLoading }: CreditHistoryProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-2">
          <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
          <div className="h-20 bg-muted rounded animate-pulse" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Credit History</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <span className={entry.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>
                  <span className={entry.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {entry.type === 'credit' ? '+' : '-'}{entry.value}
                  </span>
                </TableCell>
                <TableCell>{formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
            {history.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  No credit history available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}