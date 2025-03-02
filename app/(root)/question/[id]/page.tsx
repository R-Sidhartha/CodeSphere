import Answer from '@/components/forms/Answer'
import AllAnswers from '@/components/shared/AllAnswers'
import Metric from '@/components/shared/Metric'
import ParseHTMLWrapper from '@/components/shared/ParseHTMLWrapper'
// import ParseHTML from '@/components/shared/ParseHTML'
import RenderTag from '@/components/shared/RenderTag'
import Votes from '@/components/shared/Votes'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action'
import { formatNumber, getTimestamp } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
// import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
// const ParseHTML = dynamic(() => import('@/components/shared/ParseHTML'), { ssr: false });
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Question Details | CodeSphere',
}

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<Record<string, string>>;
}


const Page = async ({ params, searchParams }: PageProps) => {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const searchFilter = resolvedSearchParams?.filters || '';

    const questionId = resolvedParams?.id

    if (!questionId) {
        return <p className="text-red-500">Invalid Question ID.</p>;
    }

    const question = await getQuestionById({ questionId: questionId })

    const { userId: clerkId } = await auth();

    let mongoUser;
    if (clerkId) {
        mongoUser = await getUserById({ userId: clerkId });
    }

    return (
        <>
            <div className='flex-start w-full flex-col'>
                <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                    <Link
                        href={`/profile/${question?.author.clerkId}`}
                        className='flex items-center justify-start gap-1'>
                        <Image
                            src={question?.author.picture}
                            alt='profile pic'
                            width={22}
                            height={22}
                            className='rounded-full'
                        />
                        <p className='paragraph-semibold text-dark300_light700 line-clamp-1'>
                            {question?.author.name}
                        </p>
                    </Link>
                    <div className='flex justify-end'>
                        <Votes
                            type='Question'
                            itemId={JSON.stringify(question._id)}
                            userId={JSON.stringify(mongoUser._id)}
                            upvotes={question.upvotes.length}
                            downvotes={question.downvotes.length}
                            hasupVoted={question.upvotes.includes(mongoUser._id)}
                            hasdownVoted={question.downvotes.includes(mongoUser._id)}
                            hasSaved={mongoUser?.saved.includes(question._id)}
                        />
                    </div>
                </div>
                <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
                    {question.title}
                </h2>
            </div>
            <div className='mb-8 mt-5 flex flex-wrap gap-4'>
                <Metric
                    imgUrl='/assets/icons/clock.svg'
                    alt='clock icon'
                    value={` asked ${getTimestamp(question.createdAt)}`}
                    title=" Asked"
                    textStyles="small-medium text-dark400_light800"
                />
                <Metric
                    imgUrl='/assets/icons/message.svg'
                    alt='message'
                    value={formatNumber(question.answers.length)}
                    title=" Answers"
                    textStyles="small-medium text-dark400_light800"
                />
                <Metric
                    imgUrl='/assets/icons/eye.svg'
                    alt='eye'
                    value={formatNumber(question.views)}
                    title=" Views"
                    textStyles="small-medium text-dark400_light800"
                />
            </div>

            {/* <ParseHTML data={question.content} /> */}
            <ParseHTMLWrapper data={question.content} />

            <div className='mt-8 flex flex-wrap gap-2'>
                {question.tags.map((tag: any) => (
                    <RenderTag key={tag._id} name={tag.name} _id={tag._id} showCount={false} />
                ))}
            </div>

            <AllAnswers
                questionId={question._id}
                authorId={mongoUser?._id}
                totalAnswers={question.answers.length}
                filter={searchFilter}
                page={resolvedSearchParams?.page}
            />

            <Answer
                questionId={question._id.toString()}
                authorId={mongoUser?._id?.toString()}
                questionTitle={question.title}
                questionContent={question.content}
            />

        </>
    )
}

export default Page
