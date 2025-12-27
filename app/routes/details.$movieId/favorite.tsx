import { useFetcher } from "@remix-run/react";
import { HeartIcon } from "./heart-icon";
import { Button } from "~/components/ui/button";

export function Favorite({
  movie,
  className,
}: {
  movie: { favorite: boolean };
  className: string;
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
        className="rounded-full shadow-lg backdrop-blur-sm bg-background/80"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        <HeartIcon
          className={
            favorite
              ? "w-5 h-5 stroke-red-600 fill-red-600"
              : "w-5 h-5 stroke-foreground fill-none"
          }
        />
      </Button>
    </fetcher.Form>
  );
}
