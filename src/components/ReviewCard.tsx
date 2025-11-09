import { Review } from "@/types/review";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

export const ReviewCard = ({ review, onHelpful }: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  return (
    <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.userAvatar} alt={review.userName} />
            <AvatarFallback>
              {review.userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">{review.userName}</p>
              {review.verified && (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified Owner
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
      </div>

      <div>
        <h4 className="font-semibold text-lg text-foreground mb-2">
          {review.title}
        </h4>
        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
      </div>

      {review.helpful !== undefined && (
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm"
            onClick={() => onHelpful?.(review.id)}
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            Helpful ({review.helpful})
          </Button>
        </div>
      )}
    </Card>
  );
};

