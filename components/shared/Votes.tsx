'use client'

import { downvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.action';
import { viewQuestion } from '@/lib/actions/interaction.action';
import { downvoteQuestion, upvoteQuestion } from '@/lib/actions/question.action';
import { toggleSaveQuestion } from '@/lib/actions/user.action';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

interface Props {
    type: string;
    itemId: string;
    userId: string;
    upvotes: number;
    hasupVoted: boolean;
    downvotes: number;
    hasdownVoted: boolean;
    hasSaved?: boolean;
}

const Votes = ({
    type,
    itemId,
    userId,
    upvotes,
    hasupVoted,
    downvotes,
    hasdownVoted,
    hasSaved
}: Props) => {

    const pathname = usePathname();
    const router = useRouter();
    const handleVote = async (action: string) => {
        if (!userId) {
            return toast.error("Please log in", {
                description: "You must be logged in to upvote.",
            });
        }
        if (action === 'upvote') {
            if (type === 'Question') {
                await upvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname,
                })
            } else if (type === 'Answer') {
                await upvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname,
                })
            }

            const variant = hasupVoted ? "error" : "success";

            return toast[variant](`Upvote ${hasupVoted ? 'Removed' : 'Successfull'}`);

        }

        if (action === 'downvote') {
            if (type === 'Question') {
                await downvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname,
                })
            } else if (type === 'Answer') {
                await downvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname,
                })
            }
            const variant = hasdownVoted ? "error" : "success";

            return toast[variant](`downVote ${hasdownVoted ? 'Removed' : 'Successfull'}`);
        }


    }

    const handleSave = async () => {
        if (!userId) {
            return toast.error("Please log in", {
                description: "You must be logged in to save the question.",
            });
        }
        await toggleSaveQuestion({
            userId: JSON.parse(userId),
            questionId: JSON.parse(itemId),
            path: pathname,
        })

        const variant = hasSaved ? "error" : "success";
        return toast[variant](` ${hasSaved ? 'Removed from collection' : 'Successfull added to the collection'}`);
    }

    useEffect(() => {
        viewQuestion({
            questionId: JSON.parse(itemId),
            userId: userId ? JSON.parse(userId) : undefined,
        })
    }, [itemId, userId, pathname, router]);

    return (
        <div className='flex gap-5'>
            <div className='flex-center gap-2.5'>
                <div className='flex-center gap-1.5'>
                    <Image
                        src={hasupVoted ? '/assets/icons/upvoted.svg' : '/assets/icons/upvote.svg'}
                        width={18}
                        height={18}
                        alt='upvote'
                        className='cursor-pointer'
                        onClick={() => { handleVote('upvote') }}
                    />

                    <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
                        <p className='subtle-medium text-dark400_light900'>
                            {formatNumber(upvotes)}
                        </p>
                    </div>

                </div>
                <div className='flex-center gap-1.5'>
                    <Image
                        src={hasdownVoted ? '/assets/icons/downvoted.svg' : '/assets/icons/downvote.svg'}
                        width={18}
                        height={18}
                        alt='downvote'
                        className='cursor-pointer'
                        onClick={() => { handleVote('downvote') }}
                    />

                    <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
                        <p className='subtle-medium text-dark400_light900'>
                            {formatNumber(downvotes)}
                        </p>
                    </div>

                </div>

            </div>

            {type === 'Question' && (
                <Image
                    src={hasSaved ? '/assets/icons/star-filled.svg' : '/assets/icons/star-red.svg'}
                    width={18}
                    height={18}
                    alt='star'
                    className='cursor-pointer'
                    onClick={() => handleSave()}
                />
            )}
        </div>
    )
}

export default Votes
