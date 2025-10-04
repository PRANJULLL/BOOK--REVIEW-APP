import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { StarRating } from "@/components/StarRating";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [book, setBook] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
      fetchReviews();
    }
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*, profiles(name)")
        .eq("id", id)
        .single();

      if (error) throw error;
      setBook(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch book details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(name)")
        .eq("book_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (newRating === 0 || !newReview.trim()) {
      toast({
        title: "Error",
        description: "Please provide both rating and review text",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingReview) {
        const { error } = await supabase
          .from("reviews")
          .update({
            rating: newRating,
            review_text: newReview,
          })
          .eq("id", editingReview);

        if (error) throw error;
        toast({ title: "Review updated successfully!" });
      } else {
        const { error } = await supabase.from("reviews").insert({
          book_id: id,
          user_id: session.user.id,
          rating: newRating,
          review_text: newReview,
        });

        if (error) throw error;
        toast({ title: "Review submitted successfully!" });
      }

      setNewRating(0);
      setNewReview("");
      setEditingReview(null);
      fetchReviews();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditReview = (review: any) => {
    setNewRating(review.rating);
    setNewReview(review.review_text);
    setEditingReview(review.id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDeleteClick = (type: string, id: string) => {
    setDeleteTarget({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "book") {
        const { error } = await supabase
          .from("books")
          .delete()
          .eq("id", deleteTarget.id);

        if (error) throw error;
        toast({ title: "Book deleted successfully!" });
        navigate("/");
      } else {
        const { error } = await supabase
          .from("reviews")
          .delete()
          .eq("id", deleteTarget.id);

        if (error) throw error;
        toast({ title: "Review deleted successfully!" });
        fetchReviews();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const userReview = reviews.find((r) => r.user_id === session?.user?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={session?.user} />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={session?.user} />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Book not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session?.user} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Link>
        </Button>

        {/* Book Details */}
        <Card className="mb-8 shadow-[var(--shadow-card)]">
          <CardHeader>
            <div className="flex items-start gap-6">
              <div className="w-32 h-48 bg-[var(--gradient-primary)] rounded-lg flex items-center justify-center flex-shrink-0 shadow-[var(--shadow-book)]">
                <BookOpen className="w-16 h-16 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-3xl mb-2">{book.title}</CardTitle>
                    <p className="text-lg text-muted-foreground mb-2">by {book.author}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full">
                        {book.genre}
                      </span>
                      <span className="text-muted-foreground">{book.published_year}</span>
                    </div>
                  </div>
                  {session?.user?.id === book.added_by && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                      >
                        <Link to={`/edit-book/${book.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick("book", book.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={Math.round(averageRating)} />
                  <span className="text-lg font-semibold">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
                {book.description && (
                  <p className="text-foreground leading-relaxed">{book.description}</p>
                )}
                <p className="text-sm text-muted-foreground mt-4">
                  Added by {book.profiles?.name || "Unknown"}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Reviews Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Reviews</h2>

          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwnReview={session?.user?.id === review.user_id}
                  onEdit={() => handleEditReview(review)}
                  onDelete={() => handleDeleteClick("review", review.id)}
                />
              ))}
            </div>
          )}

          {/* Add/Edit Review Form */}
          {session?.user && !userReview && !editingReview && (
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Your Rating</label>
                  <StarRating
                    rating={newRating}
                    size={32}
                    interactive
                    onRatingChange={setNewRating}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Your Review</label>
                  <Textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your thoughts about this book..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleSubmitReview} className="w-full">
                  Submit Review
                </Button>
              </CardContent>
            </Card>
          )}

          {editingReview && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Your Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Your Rating</label>
                  <StarRating
                    rating={newRating}
                    size={32}
                    interactive
                    onRatingChange={setNewRating}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Your Review</label>
                  <Textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your thoughts about this book..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSubmitReview} className="flex-1">
                    Update Review
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingReview(null);
                      setNewRating(0);
                      setNewReview("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this{" "}
              {deleteTarget?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookDetails;
