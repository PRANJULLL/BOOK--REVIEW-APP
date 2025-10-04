import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

const AddBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    published_year: new Date().getFullYear(),
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setSession(session);
    };

    checkAuth();

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
      }
    });
  }, [navigate]);

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data.added_by !== session?.user?.id) {
        toast({
          title: "Error",
          description: "You can only edit books you added",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setFormData({
        title: data.title,
        author: data.author,
        description: data.description || "",
        genre: data.genre,
        published_year: data.published_year,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch book details",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a book",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (id) {
        const { error } = await supabase
          .from("books")
          .update(formData)
          .eq("id", id);

        if (error) throw error;
        toast({ title: "Book updated successfully!" });
      } else {
        const { error } = await supabase.from("books").insert({
          ...formData,
          added_by: session.user.id,
        });

        if (error) throw error;
        toast({ title: "Book added successfully!" });
      }

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session?.user} />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              {id ? "Edit Book" : "Add New Book"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre *</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                  required
                  placeholder="e.g., Fiction, Mystery, Romance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Published Year *</Label>
                <Input
                  id="year"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={formData.published_year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      published_year: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  placeholder="Tell us about this book..."
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Saving..." : id ? "Update Book" : "Add Book"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBook;
