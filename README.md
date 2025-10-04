# 📚 BookReview

A modern, full-stack book review application built with React, TypeScript, and Supabase. Share your thoughts on books, discover new reads, and connect with fellow book lovers.

## ✨ Features

- **📖 Book Management**: Add, edit, and organize your personal book collection
- **⭐ Reviews & Ratings**: Write detailed reviews and rate books on a 5-star scale
- **🔍 Smart Search**: Find books by title, author, or genre with advanced filtering
- **👤 User Profiles**: Create your reading profile and track your reviews
- **🎨 Modern UI**: Beautiful, responsive design with dark/light mode support
- **🔐 Secure Authentication**: User registration and login with Supabase Auth
- **📱 Mobile Friendly**: Optimized for all devices and screen sizes

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, Authentication, Real-time)
- **Deployment**: Vercel/Netlify ready
- **Development**: ESLint, Prettier, Husky

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PRANJULLL/bookish-haven-50.git
   cd bookish-haven-50
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file in the root directory:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   ```bash
   # Run the migration files in supabase/migrations/
   npx supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📋 API Documentation

### Authentication Endpoints

#### Sign Up
```javascript
// POST /auth/signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Sign In
```javascript
// POST /auth/signin
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Sign Out
```javascript
// POST /auth/signout
const { error } = await supabase.auth.signOut();
```

### Books API

#### Get All Books
```javascript
// GET /books
const { data: books, error } = await supabase
  .from('books')
  .select('*')
  .order('created_at', { ascending: false });
```

#### Add New Book
```javascript
// POST /books
const { data, error } = await supabase
  .from('books')
  .insert([
    {
      title: 'Book Title',
      author: 'Author Name',
      genre: 'Fiction',
      published_year: 2023,
      description: 'Book description...',
      added_by: user.id
    }
  ]);
```

#### Update Book
```javascript
// PUT /books/{id}
const { data, error } = await supabase
  .from('books')
  .update({ title: 'New Title' })
  .eq('id', bookId);
```

#### Delete Book
```javascript
// DELETE /books/{id}
const { error } = await supabase
  .from('books')
  .delete()
  .eq('id', bookId);
```

### Reviews API

#### Get Book Reviews
```javascript
// GET /reviews?book_id={bookId}
const { data: reviews, error } = await supabase
  .from('reviews')
  .select('*, profiles(name)')
  .eq('book_id', bookId);
```

#### Add Review
```javascript
// POST /reviews
const { data, error } = await supabase
  .from('reviews')
  .insert([
    {
      book_id: bookId,
      user_id: user.id,
      rating: 5,
      review_text: 'Great book!'
    }
  ]);
```

#### Update Review
```javascript
// PUT /reviews/{id}
const { data, error } = await supabase
  .from('reviews')
  .update({ rating: 4, review_text: 'Updated review' })
  .eq('id', reviewId);
```

#### Delete Review
```javascript
// DELETE /reviews/{id}
const { error } = await supabase
  .from('reviews')
  .delete()
  .eq('id', reviewId);
```

## 📁 Project Structure

```
bookish-haven-50/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Shadcn/ui components
│   │   └── BookCard.tsx   # Book display component
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── integrations/      # External service integrations
├── supabase/
│   └── migrations/        # Database migrations
└── package.json
```

## 🎯 Usage

1. **Sign Up/Login**: Create an account or sign in to get started
2. **Browse Books**: Explore the collection with search and filters
3. **Add Books**: Contribute to the collection by adding new books
4. **Write Reviews**: Share your thoughts and rate books you've read
5. **Manage Profile**: View your reading history and reviews

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Supabase](https://supabase.com/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

Made with ❤️ for book lovers everywhere
