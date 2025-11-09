import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { FriendComparison } from "@/components/FriendComparison";
import { cars } from "@/data/cars";
import { mockReviews, mockUsers } from "@/data/reviews";
import { Review } from "@/types/review";
import { Car } from "@/types/car";
import { MessageSquare, Star, Filter, Search } from "lucide-react";

const CommunityReviews = () => {
  const { carId } = useParams<{ carId?: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  // Get selected car or default to first car
  const selectedCar: Car | undefined = carId
    ? cars.find((car) => car.id === carId)
    : cars[0];

  // Filter reviews for selected car
  const carReviews = useMemo(() => {
    if (!selectedCar) return [];
    return reviews.filter((review) => review.carId === selectedCar.id);
  }, [selectedCar, reviews]);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = [...carReviews];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.title.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query) ||
          review.userName.toLowerCase().includes(query)
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter((review) => review.rating === rating);
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "helpful") {
      filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
    }

    return filtered;
  }, [carReviews, searchQuery, ratingFilter, sortBy]);

  // Calculate average rating
  const averageRating =
    carReviews.length > 0
      ? carReviews.reduce((sum, review) => sum + review.rating, 0) /
        carReviews.length
      : 0;

  const ratingDistribution = useMemo(() => {
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    carReviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  }, [carReviews]);

  const handleReviewSubmit = (newReview: Omit<Review, "id" | "date" | "helpful">) => {
    const review: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };
    setReviews([...reviews, review]);
    setShowReviewForm(false);
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: (review.helpful || 0) + 1 }
          : review
      )
    );
  };

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

  if (!selectedCar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Car not found</h2>
          <Link to="/reviews">
            <Button>Back to Reviews</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <h1 className="text-3xl font-bold text-primary tracking-tight">
                TOYOTA
              </h1>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/reviews">
                <Button variant="ghost">All Reviews</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Community Reviews
                </h1>
                <p className="text-muted-foreground mt-1">
                  {selectedCar.year} {selectedCar.brand} {selectedCar.model}
                </p>
              </div>
            </div>
          </div>

          {/* Car Selection */}
          <div className="mb-6">
            <Select
              value={selectedCar.id}
              onValueChange={(value) => {
                navigate(`/reviews/${value}`);
              }}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {cars.map((car) => (
                  <SelectItem key={car.id} value={car.id}>
                    {car.year} {car.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats and Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex">{renderStars(averageRating)}</div>
                <span className="text-3xl font-bold text-foreground">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Based on {carReviews.length} reviews
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {carReviews.length}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full"
                size="lg"
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </Button>
            </div>
          </div>

          {/* Rating Distribution */}
          {carReviews.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating];
                  const percentage =
                    carReviews.length > 0
                      ? (count / carReviews.length) * 100
                      : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-8">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm
                car={selectedCar}
                onSubmit={handleReviewSubmit}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="reviews">
                All Reviews ({filteredReviews.length})
              </TabsTrigger>
              <TabsTrigger value="friends">
                Compare with Friends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reviews List */}
              {filteredReviews.length > 0 ? (
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onHelpful={handleHelpful}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    No reviews found matching your criteria.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="friends">
              <FriendComparison
                car={selectedCar}
                reviews={reviews}
                friends={mockUsers}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CommunityReviews;

