import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const BookCardSkeleton = () => {
  return (
    <Card className="h-full border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-16 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-lg animate-pulse"></div>
          <div className="flex-1 min-w-0">
            <div className="h-6 bg-muted rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-4 bg-muted/50 rounded w-12 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 bg-muted rounded-full w-16 animate-pulse"></div>
          <div className="h-4 bg-muted/50 rounded w-12 animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
};
