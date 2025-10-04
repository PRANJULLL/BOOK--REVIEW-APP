import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { BookCard } from "@/components/BookCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userBooks, setUserBooks] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setSession(session);
      fetchUserData(session.user.id);
    };

    checkAuth();

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
        fetchUserData(session.user.id);
      }
    });
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(profileData);

      // Fetch user's books
      const { data: booksData } = await supabase
        .from("books")
        .select("*")
        .eq("added_by", userId)
        .order("created_at", { ascending: false });

      // Add ratings to books
      const booksWithRatings = await Promise.all(
        (booksData || []).map(async (book) => {
          const { data: reviews } = await supabase
            .from("reviews")
            .select("rating")
            .eq("book_id", book.id);

          const averageRating =
            reviews && reviews.length > 0
              ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
              : 0;

          return {
            ...book,
            averageRating: averageRating || undefined,
            reviewCount: reviews?.length || 0,
          };
        })
      );

      setUserBooks(booksWithRatings);

      // Fetch user's reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*, books(title, author)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setUserReviews(reviewsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session?.user} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{profile?.name || "User"}</CardTitle>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{userBooks.length}</p>
                <p className="text-sm text-muted-foreground">Books Added</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{userReviews.length}</p>
                <p className="text-sm text-muted-foreground">Reviews Written</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Books and Reviews */}
        <Tabs defaultValue="books" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="books">My Books</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="books">
            {userBooks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    You haven't added any books yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {userReviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    You haven't written any reviews yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {review.books?.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        by {review.books?.author}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < review.rating
                                  ? "text-accent"
                                  : "text-muted"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground">{review.review_text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
