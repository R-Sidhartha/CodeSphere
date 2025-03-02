import Question from '@/components/forms/Question'
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Ask a Question | CodeSphere',
    description: 'Ask and share programming questions on the Codesphere platform. Get answers from the community, explore discussions, and enhance your coding knowledge.'
}
const Page = async () => {

    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }
    const mongoUser = await getUserById({ userId });


    return (
        <div>
            <h1 className='h1-bold text-dark100_light900'>Ask a question</h1>
            <div className='mt-9'>
                <Suspense fallback={<p>Loading Question...</p>}>
                    <Question mongoUserId={JSON.stringify(mongoUser?._id)} />
                </Suspense>

            </div>
        </div>
    )
}

export default Page
