import React from "react";

export const Footer = () => {
  const handleGitHubClick = () => {
    window.open("https://github.com/PRANJULLL/BOOK-REVIEW-PLATFORM", "_blank");
    alert("Opening GitHub repository...");
  };

  const handleAboutClick = () => {
    alert("About BookReview: A platform for book lovers to share and discover reviews!");
  };

  const handleContactClick = () => {
    alert("Contact us at: support@bookreview.com");
  };

  return (
    <footer className="bg-card/80 backdrop-blur-md border-t sticky bottom-0 z-40">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} BookReview. All rights reserved.</div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <button onClick={handleGitHubClick} className="hover:text-primary transition-colors cursor-pointer">
            GitHub
          </button>
          <button onClick={handleAboutClick} className="hover:text-primary transition-colors cursor-pointer">
            About
          </button>
          <button onClick={handleContactClick} className="hover:text-primary transition-colors cursor-pointer">
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
};
