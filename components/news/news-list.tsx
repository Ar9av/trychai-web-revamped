import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import LoadingSkeleton from "@/components/ui/loading-skeleton"

interface NewsItem {
  id: number
  hashtag: string
  date: string
  news_json: {
    title: string
    content: string
    source?: string
  }
}

interface NewsListProps {
  news: NewsItem[]
  isLoading: boolean
}

export function NewsList({ news, isLoading }: NewsListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  console.log("news", news);

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <div className="text-sm text-muted-foreground">
              {item.date ? formatDistanceToNow(new Date(item.date), { addSuffix: true }) : null}
            </div>
          </div>
          <p className="text-muted-foreground mb-4">{item.content}</p>
          {item.summary && (
            <p className="text-muted-foreground mb-4">
              <strong>Summary:</strong> {item.summary}
            </p>
          )}
          <div className="flex justify-between items-center text-sm">
            {item.source && (
              <span className="text-muted-foreground">
                Source: {item.source}
              </span>
            )}
            <span className="text-primary font-medium">{item.hashtag}</span>
          </div>
          {item.publishedDate && (
            <p className="text-sm text-muted-foreground">
              <strong>Published Date:</strong> {new Date(item.publishedDate).toLocaleDateString()}
            </p>
          )}
          {item.url && (
            <p className="text-sm text-muted-foreground mt-2">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                Read more
              </a>
            </p>
          )}
        </Card>
      ))}
      {news.length === 0 && !isLoading && (
        <Card className="p-8 text-center text-muted-foreground">
          No news items found
        </Card>
      )}
    </div>
  );
}
