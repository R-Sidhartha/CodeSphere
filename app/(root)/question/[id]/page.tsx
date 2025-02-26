import { getQuestionById } from '@/lib/actions/question.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Page = async ({ params }: { params: { id: string } }) => {

    const questionId = params.id

    if (!questionId) {
        return <p className="text-red-500">Invalid Question ID.</p>;
    }

    const question = await getQuestionById({ questionId: questionId })
    return (
        <>
            <div className='flex-start w-full flex-col'>
                <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                    <Link
                        href={`/profile/${question?.author.clerkId}`}>
                        <Image
                            src={question?.author.picture || "/assets/images/default-profile.svg"}
                            alt='profile pic'
                            width={22}
                            height={22}
                            className='rounded-full'
                        />
                        <p className='paragraph-semibold text-dark300_light700 line-clamp-1'>
                            {question?.author.name}
                        </p>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Page
