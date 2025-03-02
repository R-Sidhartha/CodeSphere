import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
    return (
        <>
            <h1 className='h1-bold text-dark100_light900'>Question Detail</h1>
            <div className='mb-12 mt-11 flex flex-wrap gap-5'>
                <Skeleton className='h-14 flex-1 w-full' />
            </div>

            <div className='flex flex-wrap gap-4'>
                <Skeleton className='h-60 flex-1 w-full' />
            </div>

        </>
    )
}

export default Loading
