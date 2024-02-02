import { useParams } from "@remix-run/react";

export default function Details() {
  const params = useParams();

  return <div>Details from movie: {params.id}</div>;
}
