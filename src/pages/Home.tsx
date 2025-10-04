import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookCard } from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  published_year: number;
  averageRating?: number;
  reviewCount?: number;
}

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [session, setSession] = useState<Session | null>(null);
  const booksPerPage = 6;
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, genreFilter]);

  const fetchBooks = async () => {
    try {
      const { data: booksData, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch reviews and calculate average ratings
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

      setBooks(booksWithRatings);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (genreFilter !== "all") {
      filtered = filtered.filter((book) => book.genre === genreFilter);
    }

    setFilteredBooks(filtered);
    setPage(1);
  };

  const genres = ["all", ...new Set(books.map((book) => book.genre))];
  const startIndex = (page - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session?.user} />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center bg-[var(--gradient-hero)] rounded-2xl p-12 shadow-[var(--shadow-card)]">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            Discover Your Next Great Read
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share reviews, find recommendations, and connect with fellow book lovers
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre === "all" ? "All Genres" : genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading books...</p>
          </div>
        ) : currentBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No books found</p>
            {session?.user && (
              <Button asChild className="mt-4">
                <a href="/add-book">Add the first book</a>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
