import { createCookie } from "@remix-run/node";

export const userFavorites = createCookie("user-favorites", {
  maxAge: 604_800, // 1 week
});
