import { useFetcher } from "@remix-run/react";
import { Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function Favorite({
  movie,
  className,
}: {
  movie: { favorite: boolean };
  className?: string;
}) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData ? fetcher.formData.get("favorite") === "true" : movie.favorite;

  return (
    <fetcher.Form method="post" className={cn("w-full", className)}>
      <Button
        variant="secondary"
        className={cn(
          "w-full h-11 flex items-center justify-center gap-2 text-[13px] font-black uppercase tracking-wider transition-all border-none rounded-sm",
          favorite 
            ? "bg-accent text-white hover:bg-accent/90" 
            : "bg-brand-button text-white hover:bg-brand-button-hover"
        )}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        <Heart
          className={cn("w-4 h-4", favorite ? "fill-white" : "")}
        />
        {favorite ? "Favorited" : "Add to favorites"}
      </Button>
    </fetcher.Form>
  );
}
