import { formatNumber, getTimestamp } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import Metric from '../shared/Metric'
import { SignedIn } from '@clerk/nextjs';
import EditDeleteAction from '../shared/EditDeleteAction';

interface Props {
    _id: string;
    author: {
        _id: string;
        name: string;
        picture: string;
        clerkId: string;
    };
    upvotes: string[];
    createdAt: Date;
    clerkId?: string;
    question: {
        _id: string;
        title: string;
    };
}


const AnswerCard = ({
    clerkId,
    _id,
    question,
    author,
    upvotes,
    createdAt
}: Props) => {
    const showActionButton = clerkId && clerkId === author.clerkId;

    return (
        <div className='card-wrapper p-9 sm:px-11 rounded-[10px]'>
            <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
                <div>
                    <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden '>{getTimestamp(createdAt)}</span>
                    <Link
                        href={`/question/${question._id}/#${_id}`}
                    >
                        <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1 '>
                            {question.title}
                        </h3>
                    </Link>
                </div>
                <SignedIn>
                    {showActionButton && (
                        <EditDeleteAction
                            type='Answer'
                            itemId={JSON.stringify(_id)}
                        />
                    )}
                </SignedIn>
            </div>
            <div className='flex-between mt-6 w-full flex-wrap gap-3'>
                <Metric
                    imgUrl={author.picture}
                    alt='user'
                    value={author.name}
                    title={` - asked ${getTimestamp(createdAt)}`}
                    href={`/profile/${author._id}`}
                    isAuthor
                    textStyles="body-medium text-dark400_light700"
                />
                <Metric
                    imgUrl='/assets/icons/like.svg'
                    alt='upvotes'
                    value={formatNumber(upvotes.length)}
                    title=" Votes"
                    textStyles="small-medium text-dark400_light800"
                />
            </div>
        </div>

    )
}

export default AnswerCard
