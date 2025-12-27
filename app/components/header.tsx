import { Link } from "@remix-run/react";
import { Film, Heart } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-lg mx-auto flex h-14 items-center px-3 sm:px-4 lg:px-0">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Film className="h-5 w-5" />
          <span>Fuzzy Movie</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          <Link
            to="/favorites"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Favorites"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
