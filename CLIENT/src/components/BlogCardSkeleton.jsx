import { Skeleton } from '@/components/ui/skeleton';

const BlogCardSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-green-100 flex flex-col">
      <Skeleton className="h-56 w-full" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
