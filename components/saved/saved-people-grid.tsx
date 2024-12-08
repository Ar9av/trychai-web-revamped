import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SavedPerson {
  id: number;
  author: string | null;
  title: string | null;
  summary: string | null;
  url: string | null;
  image_url: string | null;
  published_date: string | null;
  created_at: string;
  tags: string | null;
}

interface SavedPeopleGridProps {
  people: SavedPerson[];
  isLoading: boolean;
  onDelete: (url: string) => void;
}

export function SavedPeopleGrid({ people, isLoading, onDelete }: SavedPeopleGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (people.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No saved profiles found</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => (
        <Card key={person.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {person.image_url ? (
                  <img
                    src={person.image_url}
                    alt={person.title ?? ''}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/avatar.png';
                    }}
                  />
                ) : (
                  <img
                    src="/avatar.png"
                    alt="Placeholder"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-lg">
                    {person.author ?? 'Untitled'}
                  </CardTitle>
                  {person.title && (
                    <CardDescription className="text-sm">
                      {person.title}
                    </CardDescription>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {person.summary && (
              <p className="text-sm text-muted-foreground mb-4">{person.summary}</p>
            )}
            {person.tags && (
              <div className="mb-4">
                <span className="text-xs text-muted-foreground">Found in search: </span>
                <span className="text-xs font-medium">{person.tags}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Saved {formatDistanceToNow(new Date(person.created_at), { addSuffix: true })}
              </span>
              <div className="flex justify-end gap-2 mt-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => person.url && onDelete(person.url)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                {person.url && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(person.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
          <Skeleton className="h-20 w-full mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
}