import { useState } from "react";
import { Car } from "@/types/car";
import { Review } from "@/types/review";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReviewFormProps {
  car: Car;
  onSubmit: (review: Omit<Review, "id" | "date" | "helpful">) => void;
  onCancel?: () => void;
}

export const ReviewForm = ({ car, onSubmit, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast({
        title: "Fields required",
        description: "Please fill in both title and comment fields.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      carId: car.id,
      userId: "current-user", // In a real app, this would come from auth
      userName: "You", // In a real app, this would come from auth
      rating,
      title: title.trim(),
      comment: comment.trim(),
      verified: false,
    });

    // Reset form
    setRating(0);
    setTitle("");
    setComment("");
    
    toast({
      title: "Review submitted!",
      description: "Thank you for your review.",
    });
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const starValue = i + 1;
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none transition-transform hover:scale-110"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              starValue <= (hoveredRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Share your experience with the {car.year} {car.model}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="text-base mb-3 block">Rating *</Label>
          <div className="flex items-center gap-2">{renderStars()}</div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {rating} out of 5 stars
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="title">Review Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            className="mt-2"
            maxLength={100}
          />
        </div>

        <div>
          <Label htmlFor="comment">Your Review *</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others about your experience with this vehicle..."
            className="mt-2 min-h-[120px]"
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {comment.length}/1000 characters
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            Submit Review
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

