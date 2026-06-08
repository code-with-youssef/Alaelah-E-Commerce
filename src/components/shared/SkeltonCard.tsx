export function SkeletonCard() {
  return (
    <div
      className="flex-shrink-0 flex flex-col rounded-2xl p-2 animate-pulse"
      style={{
        width: "9.5rem",
        backgroundColor: "var(--color-bg)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="rounded-xl mb-2"
        style={{ aspectRatio: "1/1", backgroundColor: "var(--color-bg-subtle)" }}
      />
      <div className="h-3 rounded-full mb-1.5 w-3/4" style={{ backgroundColor: "var(--color-bg-subtle)" }} />
      <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: "var(--color-bg-subtle)" }} />
    </div>
  );
}