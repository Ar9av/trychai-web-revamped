import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

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
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold">{item.news_json.title}</h2>
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
            </div>
          </div>
          <p className="text-muted-foreground mb-4">{item.news_json.content}</p>
          <div className="flex justify-between items-center text-sm">
            {item.news_json.source && (
              <span className="text-muted-foreground">
                Source: {item.news_json.source}
              </span>
            )}
            <span className="text-primary font-medium">
              {item.hashtag}
            </span>
          </div>
        </Card>
      ))}
      {news.length === 0 && !isLoading && (
        <Card className="p-8 text-center text-muted-foreground">
          No news items found
        </Card>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}