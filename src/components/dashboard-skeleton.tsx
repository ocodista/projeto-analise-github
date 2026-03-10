function SkeletonBox({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-xl border border-border bg-surface ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonBox key={i} className="h-64" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SkeletonBox className="h-80" />
        <SkeletonBox className="h-80" />
      </div>
      <SkeletonBox className="h-96" />
    </div>
  );
}
