import React from 'react'
import Filter from './Filter';
import { AnswerFilters } from '@/constants/filters';
import { getAnswers } from '@/lib/actions/answer.action';
import Link from 'next/link';
import Image from 'next/image';
import { getTimestamp } from '@/lib/utils';
// import ParseHTML from './ParseHTML';
import Votes from './Votes';
import ParseHTMLWrapper from './ParseHTMLWrapper';
import Pagination from './Pagination';

interface Props {
    questionId: string;
    authorId: string;
    totalAnswers: number;
    page?: string;
    filter?: string;
}

const AllAnswers = async ({ questionId, authorId, totalAnswers, page, filter }: Props) => {
    const result = await getAnswers({
        questionId,
        page: page ? +page : 1,
        sortBy: filter
    })
    return (
        <div className='mt-11'>
            <div className='flex items-center justify-between'>
                <h3 className='primary-text-gradient'>{totalAnswers} Answers</h3>
                <Filter
                    filters={AnswerFilters}
                />
            </div>

            <div>
                {result?.answers?.map((answer) => (
                    <article key={answer._id} className='light-border border-b py-10 flex flex-col w-full'>
                        <div className='flex items-center justify-between'>
                            <div className='mb-8 w-full flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                                <Link
                                    href={`/profile/${answer.author.clerkId}`}
                                    className='flex flex-1 items-start gap-1 sm:items-center'
                                >
                                    <Image
                                        src={answer.author.picture}
                                        alt='profile pic'
                                        width={18}
                                        height={18}
                                        className='rounded-full object-cover max-sm:mt-0.5'
                                    />
                                    <div className='flex flex-col sm:flex-row gap-1 sm:items-center'>
                                        <p className='body-semibold text-dark300_light700'>
                                            {answer.author.name}
                                        </p>

                                        <p className='small-regular text-light400_light500 mt-0.5 lime-clamp-1'>
                                            <span className='max-sm:hidden'>
                                                {" "} -
                                            </span> answered {" "} {getTimestamp(answer.createdAt)}
                                        </p>

                                    </div>
                                </Link>
                                <div className='flex justify-end'>
                                    <Votes
                                        type='Answer'
                                        itemId={JSON.stringify(answer._id)}
                                        userId={JSON.stringify(authorId)}
                                        upvotes={answer.upvotes.length}
                                        downvotes={answer.downvotes.length}
                                        hasupVoted={answer.upvotes.includes(authorId)}
                                        hasdownVoted={answer.downvotes.includes(authorId)}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <ParseHTML data={answer.content} /> */}
                        <ParseHTMLWrapper data={answer.content} />
                    </article>
                ))}
            </div>
            <div className='mt-10'>
                <Pagination
                    pageNumber={page ? +page : 1}
                    isNext={result?.isNext}
                />
            </div>
        </div>
    )
}

export default AllAnswers
