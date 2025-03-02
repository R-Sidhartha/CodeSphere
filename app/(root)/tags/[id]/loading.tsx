import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
    return (
        <>
            <h1 className='h1-bold text-dark100_light900'>Tag</h1>

            <div className='mb-5 mt-8 flex flex-wrap gap-5'>
                <Skeleton className='h-14 flex-1' />
            </div>

            <div className=' gap-4'>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                    <div className="mt-9 space-y-4" key={item}>
                        <Skeleton className="h-16 w-full" />
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-16 rounded-md" />
                            <Skeleton className="h-9 w-16 rounded-md" />
                        </div>
                        <div className="w-full flex gap-6 items-center rounded-lg">
                            {/* Author Info */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>

                            {/* Post Stats */}
                            <div className="flex gap-6 mt-3">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </>
    )
}

export default Loading
