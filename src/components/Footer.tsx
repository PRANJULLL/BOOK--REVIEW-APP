import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-card/80 backdrop-blur-md border-t sticky bottom-0 z-40">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} BookReview. All rights reserved.</div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="https://github.com/PRANJULLL/BOOK-REVIEW-PLATFORM" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            GitHub
          </a>
          <a href="/about" className="hover:text-primary transition-colors">
            About
          </a>
          <a href="/contact" className="hover:text-primary transition-colors">
            Contact
          </a>
          <a href="/backend" className="hover:text-primary transition-colors">
            Backend
          </a>
        </div>
      </div>
    </footer>
  );
};
