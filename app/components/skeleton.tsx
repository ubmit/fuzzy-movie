export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={["animate-pulse rounded-md bg-primary/10", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
