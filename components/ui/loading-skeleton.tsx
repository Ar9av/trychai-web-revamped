  import { Card } from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton-2";

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Create three skeleton cards */}
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="p-6">
          <div className="space-y-4">
            {/* Skeleton for the title */}
            <Skeleton className="h-6 w-3/4" />
            {/* Skeleton for content */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            {/* Skeleton for metadata (e.g., date, source) */}
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
