'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'circle';
  animate?: boolean;
}

export function Skeleton({ 
  className, 
  variant = 'default',
  animate = true 
}: SkeletonProps) {
  const baseStyles = 'bg-white/10';
  
  const variantStyles = {
    default: 'rounded-md',
    card: 'rounded-2xl',
    text: 'rounded',
    avatar: 'rounded-full',
    circle: 'rounded-full',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animate && 'animate-pulse',
        className
      )}
    />
  );
}

// Pre-built skeleton layouts
export function ProjectCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <Skeleton variant="avatar" className="w-14 h-14" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      
      {/* Status */}
      <Skeleton className="h-6 w-24 rounded-full mb-5" />
      
      {/* Description */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Progress */}
      <div className="p-3 rounded-xl bg-black/20 mb-5">
        <div className="flex justify-between mb-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
      
      {/* Footer */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton variant="circle" className="w-10 h-10" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-20 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === 0 ? "w-1/4" : "flex-1"
          )} 
        />
      ))}
    </div>
  );
}
