import { getUserQuestion } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react'
import QuestionCard from '../cards/QuestionCard';

interface Props extends SearchParamsProps {
    userId: string;
    clerkId: string;
}

const QuestionTab = async ({ userId, clerkId, searchParams }: Props) => {

    const result = await getUserQuestion({
        userId,
        page: 1
    })
    return (
        <>
            {result.questions.map((question) => (
                <QuestionCard
                    key={question._id}
                    _id={question._id}
                    title={question.title}
                    clerkId={clerkId}
                    tags={question.tags}
                    author={question.author}
                    upvotes={question.upvotes}
                    views={question.views}
                    answers={question.answers}
                    createdAt={question.createdAt}
                />
            ))}
        </>
    )
}

export default QuestionTab
