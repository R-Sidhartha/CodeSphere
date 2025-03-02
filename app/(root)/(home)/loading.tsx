import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
    return (
        <>
            <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
                <h1 className='h1-bold text-dark100_light900'>All Questions</h1>
                <div className='min-h-[40px] w-[260px] px-4 py-3 hidden md:block '>
                    <Skeleton className='h-14 flex-1 ' />
                </div>
            </div>
            <div className='mb-5 mt-8 flex flex-wrap gap-5'>
                <Skeleton className='h-14 flex-1' />
            </div>

            <div className="mb-8 mt-2 hidden lg:grid grid-cols-6 md:grid-cols-4 gap-4 lg:grid-cols-6">
                {[1, 2, 3, 4].map((item) => (
                    <Skeleton
                        key={item}
                        className="h-10 w-32 rounded-md"
                    />
                ))}
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
