import { useFetcher } from "@remix-run/react";
import { Heart } from "lucide-react";
import { Button } from "~/components/ui/button";

export function Favorite({
  movie,
  className,
}: {
  movie: { favorite: boolean };
  className?: string;
}) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : movie.favorite;

  return (
    <fetcher.Form method="post" className={className}>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        <Heart
          className={
            favorite
              ? "w-5 h-5 text-red-500 fill-red-500"
              : "w-5 h-5 text-foreground"
          }
        />
      </Button>
    </fetcher.Form>
  );
}
