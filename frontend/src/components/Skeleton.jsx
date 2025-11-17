import React from 'react';

/**
 * Base Skeleton component for loading states
 */
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-800/60 rounded ${className}`}
      {...props}
    />
  );
};

/**
 * Card Skeleton - for blog posts, projects, etc.
 */
export const CardSkeleton = () => {
  return (
    <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl shadow-md overflow-hidden border border-gray-800">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <Skeleton className="h-4 w-24" /> {/* Date */}
        <Skeleton className="h-6 w-3/4" /> {/* Title */}
        <Skeleton className="h-4 w-full" /> {/* Excerpt line 1 */}
        <Skeleton className="h-4 w-5/6" /> {/* Excerpt line 2 */}
        <Skeleton className="h-4 w-20 mt-4" /> {/* Read more link */}
      </div>
    </div>
  );
};

/**
 * Project Card Skeleton
 */
export const ProjectCardSkeleton = () => {
  return (
    <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl shadow-md overflow-hidden border border-gray-800">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" /> {/* Title */}
        <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
        <Skeleton className="h-4 w-4/5" /> {/* Description line 2 */}

        {/* Tech tags */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Links */}
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
};

/**
 * List Item Skeleton - for ideas, tools, etc.
 */
export const ListItemSkeleton = () => {
  return (
    <div className="flex items-start p-4 space-x-4">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-3/4" /> {/* Title */}
        <Skeleton className="h-4 w-full" /> {/* Description */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
};

/**
 * Grid of Card Skeletons
 */
export const CardSkeletonGrid = ({ count = 3, type = 'card' }) => {
  const SkeletonComponent = type === 'project' ? ProjectCardSkeleton : CardSkeleton;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

/**
 * Two Column Grid Skeleton
 */
export const TwoColumnSkeletonGrid = ({ count = 2 }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Skeleton;
