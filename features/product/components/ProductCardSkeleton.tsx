import { Card, CardContent, CardFooter } from "@/shared/ui";

function ProductCardSkeleton() {
  return (
    <Card className="w-full max-w-sm rounded-none gap-0 border-0 shadow-md p-0 animate-pulse">
      {/* Image Skeleton */}
      <CardContent className="p-0 relative overflow-hidden">
        <div className="w-full h-48 bg-gray-200 " />
        <div className="absolute bottom-2 right-2 h-9 w-9 rounded-full bg-gray-300 " />
      </CardContent>

      {/* Info Skeleton */}
      <CardFooter className="flex flex-col gap-3 bg-primary-foreground p-4">
        <div className="flex justify-between w-full items-start">
          <div className="flex flex-col flex-1 gap-2">
            <div className="h-4 w-3/4 bg-gray-200  rounded"></div>
            <div className="h-3 w-full bg-gray-200  rounded"></div>
            <div className="h-3 w-5/6 bg-gray-200  rounded"></div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-4 w-12 bg-gray-200  rounded"></div>
            <div className="h-3 w-10 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="flex justify-end w-full">
          <div className="h-4 w-16 bg-gray-200  rounded-full"></div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCardSkeleton;
