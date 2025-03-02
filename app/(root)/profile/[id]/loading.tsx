import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <Skeleton className="w-52 h-36 rounded-full" />

                <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-12 w-40" />
                    <Skeleton className="h-12 w-32" />

                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                </div>

                <Skeleton className="h-12 w-32 rounded-lg" />
            </div>

            <div className="mt-4">
                <Skeleton className="h-12 w-48" />
            </div>

            <div className="mt-6">
                <Skeleton className="h-9 w-24" />

                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-11">
                    {[1, 2, 3, 4].map((_, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <Skeleton className="h-28 w-32" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex gap-2">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
            </div>

            <div className="mt-6 space-y-4">
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-16 rounded-md" />
                    <Skeleton className="h-9 w-16 rounded-md" />
                </div>
            </div>
        </div>
    );
};

export default Loading;
