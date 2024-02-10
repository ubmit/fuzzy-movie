import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { userFavorites } from "../../cookies.server";
import { getMovieById } from "~/data/get-movie-by-id";
import { SVGProps } from "react";

type Cookie = { favorites: string[] };

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.movieId, "Missing movieId param");

  const movie = await getMovieById(params.movieId);
  invariant(movie, "Movie not found");

  const cookieHeader = request.headers.get("Cookie");
  const cookie: Cookie = (await userFavorites.parse(cookieHeader)) ?? {
    favorites: [],
  };

  return json({ movie, favorite: cookie.favorites.includes(params.movieId) });
}

export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.movieId, "Missing movieId param");

  const cookieHeader = request.headers.get("Cookie");
  const cookie: Cookie = (await userFavorites.parse(cookieHeader)) ?? {
    favorites: [],
  };

  const formData = await request.formData();
  if (formData.get("favorite") === "true") {
    cookie.favorites = [...cookie.favorites, params.movieId];
  } else {
    cookie.favorites = cookie.favorites.filter(
      (id: string) => id !== params.movieId
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Set-Cookie": await userFavorites.serialize(cookie),
    },
  });
}

export default function Details() {
  const { movie, favorite } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-5xl text-gray-900">{movie.Title}</h1>

      <div className="flex gap-4 mt-12">
        <div className="relative w-72 h-[432px]">
          <Favorite
            movie={{ favorite }}
            className="absolute inset-y-0 right-0"
          />
          <img
            className="w-full h-full object-cover overflow-hidden"
            src={movie.Poster}
            alt={movie.Title}
          />
        </div>
        <p className="m-0 max-w-[576px]">{movie.Plot}</p>
      </div>
    </div>
  );
}

function Favorite({
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

function HeartIcon({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2c-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    </svg>
  );
}
