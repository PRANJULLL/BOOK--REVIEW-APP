import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    genre: string;
    published_year: number;
    averageRating?: number;
    reviewCount?: number;
  };
}

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link to={`/book/${book.id}`}>
      <Card className="h-full transition-all hover:shadow-[var(--shadow-book)] hover:-translate-y-1 cursor-pointer group">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-16 h-24 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {book.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {book.averageRating ? (
                <>
                  <StarRating rating={book.averageRating} size={16} />
                  <span className="text-sm text-muted-foreground">
                    ({book.reviewCount || 0})
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">No reviews yet</span>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
              {book.genre}
            </span>
            <span className="text-muted-foreground">{book.published_year}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
