import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { useClerk } from "@clerk/nextjs"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmationDialog } from "@/components/ui/alert-dialog-custom"
import { deleteReport } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

interface Report {
  id: number
  title: string
  md5_hash: string
  created_at: string
}

interface ReportListProps {
  reports: Report[]
  isLoading: boolean
  isPrivate?: boolean
  onReportDeleted?: () => void
}

export function ReportList({ reports, isLoading, isPrivate = false, onReportDeleted }: ReportListProps) {
  const { session } = useClerk();
  const userEmail = session?.user.emailAddresses[0].emailAddress;

  const handleDelete = async (hash: string) => {
    try {
      if (!userEmail) return;
      await deleteReport(userEmail, hash);
      toast({
        title: "Success",
        description: "Report deleted successfully",
      });
      if (onReportDeleted) {
        onReportDeleted();
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created</TableHead>
            {/* <TableHead>Hash</TableHead> */}
            {isPrivate && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell 
                className="font-medium cursor-pointer"
                onClick={() => window.location.href = `/research/${report.md5_hash}`}
              >
                {report.title}
              </TableCell>
              <TableCell 
                className="cursor-pointer"
                onClick={() => window.location.href = `/research/${report.md5_hash}`}
              >
                {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
              </TableCell>
              {/* <TableCell 
                className="font-mono text-sm cursor-pointer"
                onClick={() => window.location.href = `/research/${report.md5_hash}`}
              >
                {report.md5_hash}
              </TableCell> */}
              {isPrivate && (
                <TableCell>
                  <DeleteConfirmationDialog
                    trigger={
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    }
                    title="Delete Report"
                    description="Are you sure you want to delete this report? This action cannot be undone."
                    onConfirm={() => handleDelete(report.md5_hash)}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
          {reports.length === 0 && (
            <TableRow>
              <TableCell colSpan={isPrivate ? 4 : 3} className="text-center text-muted-foreground py-8">
                No reports found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Hash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}