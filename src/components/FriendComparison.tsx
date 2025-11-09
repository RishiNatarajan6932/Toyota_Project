import { useState } from "react";
import { Car } from "@/types/car";
import { Review } from "@/types/review";
import { User } from "@/types/review";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Users, TrendingUp } from "lucide-react";
import { ReviewCard } from "./ReviewCard";

interface FriendComparisonProps {
  car: Car;
  reviews: Review[];
  friends: User[];
  currentUserId?: string;
}

export const FriendComparison = ({
  car,
  reviews,
  friends,
  currentUserId = "current-user",
}: FriendComparisonProps) => {
  const [selectedFriend, setSelectedFriend] = useState<string>("all");

  // Get friend reviews for this car
  const friendReviews = reviews.filter(
    (review) =>
      friends.some((friend) => friend.id === review.userId && friend.isFriend) &&
      review.carId === car.id
  );

  // Get current user's review
  const currentUserReview = reviews.find(
    (review) => review.userId === currentUserId && review.carId === car.id
  );

  // Filter by selected friend
  const filteredReviews =
    selectedFriend === "all"
      ? friendReviews
      : friendReviews.filter((review) => review.userId === selectedFriend);

  // Calculate average rating
  const averageRating =
    friendReviews.length > 0
      ? friendReviews.reduce((sum, review) => sum + review.rating, 0) /
        friendReviews.length
      : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              Compare with Friends
            </h3>
            <p className="text-sm text-muted-foreground">
              See what your friends think about the {car.model}
            </p>
          </div>
        </div>
      </div>

      {friendReviews.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            None of your friends have reviewed this vehicle yet.
          </p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(averageRating)}</div>
                <span className="text-lg font-bold text-foreground">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            </Card>

            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">Friend Reviews</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {friendReviews.length}
              </p>
            </Card>

            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">Your Rating</p>
              </div>
              {currentUserReview ? (
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(currentUserReview.rating)}</div>
                  <span className="text-lg font-bold text-foreground">
                    {currentUserReview.rating}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not rated yet</p>
              )}
            </Card>
          </div>

          {/* Filter by friend */}
          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium">Filter by friend:</Label>
            <Select value={selectedFriend} onValueChange={setSelectedFriend}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All friends" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All friends</SelectItem>
                {friends
                  .filter((friend) => friend.isFriend)
                  .map((friend) => (
                    <SelectItem key={friend.id} value={friend.id}>
                      {friend.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comparison Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Reviews ({friendReviews.length})</TabsTrigger>
              {currentUserReview && (
                <TabsTrigger value="comparison">
                  Your Review vs Friends
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </TabsContent>

            {currentUserReview && (
              <TabsContent value="comparison" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <Badge className="mb-2">Your Review</Badge>
                    <ReviewCard review={currentUserReview} />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Friends' Reviews
                    </Badge>
                    {filteredReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </>
      )}
    </Card>
  );
};

