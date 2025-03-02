import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react'
import AnswerCard from '../cards/AnswerCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
    userId: string;
    clerkId: string;
    SearchParams?: { [key: string]: string | undefined }
}

const AnswersTab = async ({ userId, clerkId, SearchParams }: Props) => {

    const result = await getUserAnswers({
        userId,
        page: SearchParams?.page ? +SearchParams.page : 1
    })
    return (
        <>
            {result.answers.map((item) => (
                <AnswerCard
                    key={item._id}
                    clerkId={clerkId}
                    _id={item._id}
                    question={item.question}
                    author={item.author}
                    upvotes={item.upvotes}
                    createdAt={item.createdAt}
                />
            ))}
            <div className='mt-10'>
                <Pagination
                    pageNumber={SearchParams?.page ? +SearchParams.page : 1}
                    isNext={result?.isNext}
                />
            </div>
        </>
    )
}

export default AnswersTab
