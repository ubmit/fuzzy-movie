import { Link, useLocation } from "@remix-run/react";
import { Heart } from "lucide-react";
import { cn } from "~/lib/utils";

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-white/5 py-4">
      <div className="max-w-screen-lg mx-auto flex h-10 items-center px-3 sm:px-4 lg:px-0">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex">
            <div className="h-4 w-4 rounded-full bg-accent ring-1 ring-black/20 z-30" />
            <div className="h-4 w-4 rounded-full bg-primary ring-1 ring-black/20 -ml-1 z-20" />
            <div className="h-4 w-4 rounded-full bg-info ring-1 ring-black/20 -ml-1 z-10" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase ml-1">
            Fuzzy
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link
            to="/"
            className={cn(
              "text-[11px] font-bold tracking-[0.15em] uppercase transition-colors hover:text-white",
              location.pathname === "/" ? "text-white" : "text-muted-foreground"
            )}
          >
            Movies
          </Link>
          <Link
            to="/favorites"
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors hover:text-white",
              location.pathname === "/favorites" ? "text-white" : "text-muted-foreground"
            )}
          >
            <Heart className={cn("h-3 w-3", location.pathname === "/favorites" ? "fill-accent text-accent" : "")} />
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
}
