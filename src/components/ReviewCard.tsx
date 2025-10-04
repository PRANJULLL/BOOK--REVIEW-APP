import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "./StarRating";
import { Pencil, Trash2 } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    review_text: string;
    created_at: string;
    profiles: {
      name: string;
      avatar_url?: string;
    };
  };
  isOwnReview?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ReviewCard = ({ review, isOwnReview, onEdit, onDelete }: ReviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={review.profiles.avatar_url} alt={review.profiles.name} />
              <AvatarFallback>{review.profiles.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-lg">{review.profiles.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.rating} size={16} />
                <span className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          {isOwnReview && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground leading-relaxed">{review.review_text}</p>
      </CardContent>
    </Card>
  );
};
