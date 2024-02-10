import { useFetcher } from "@remix-run/react";
import { HeartIcon } from "./heart-icon";

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
      <button
        className="p-2 mt-2 mr-2 rounded-md bg-gray-200/60 backdrop-blur-md shadow-md"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        <HeartIcon
          className={[
            "w-6 h-6 stroke-2",
            favorite
              ? "stroke-red-600 fill-red-600"
              : "stroke-gray-500 fill-none",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </button>
    </fetcher.Form>
  );
}
