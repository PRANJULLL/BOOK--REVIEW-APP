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
      <Card className="h-full transition-all duration-300 hover:shadow-[var(--shadow-book)] hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-14 h-20 sm:w-16 sm:h-24 bg-gradient-to-br from-primary via-primary/90 to-accent rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
              <div className="absolute top-1 left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-1 h-1 sm:w-1 sm:h-1 bg-white/30 rounded-full"></div>
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground relative z-10 drop-shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-lg"></div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
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
