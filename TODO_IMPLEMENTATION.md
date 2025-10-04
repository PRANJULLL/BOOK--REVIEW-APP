# Implementation Plan for Pending TODO Items

## Information Gathered
- Project is a React app with Vite, Tailwind CSS, shadcn/ui, Supabase.
- ThemeProvider and ThemeToggle components exist but not integrated in Navbar.
- No Footer component exists.
- ReviewCard displays user name but no avatar.
- Search in Home.tsx is basic (title/author), filter by genre.
- UI components use shadcn/ui which already have good interactive elements.
- Typography can be improved in index.css for better hierarchy.

## Plan
- [x] Integrate ThemeToggle into Navbar for dark mode toggle.
- [x] Create Footer component with links and branding.
- [x] Add Footer to App.tsx layout.
- [x] Enhance interactive elements: add hover effects and better button styles.
- [x] Improve typography: adjust font sizes and weights in index.css.
- [x] Add user avatars to ReviewCard using Avatar component.
- [x] Improve Search/Filter UX: add debouncing to search, additional filters.

## Dependent Files to be edited
- [x] bookish-haven-50/src/components/Navbar.tsx: Add ThemeToggle (already done)
- [x] bookish-haven-50/src/components/Footer.tsx: Create new component
- [x] bookish-haven-50/src/App.tsx: Add Footer to layout
- [x] bookish-haven-50/src/components/ReviewCard.tsx: Add Avatar
- [x] bookish-haven-50/src/pages/Home.tsx: Improve search/filter
- [x] bookish-haven-50/src/index.css: Typography improvements

## Followup steps
- [ ] Test the changes locally
- [ ] Commit changes with descriptive message
- [ ] Push to GitHub repo
