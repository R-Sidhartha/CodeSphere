import { getUserQuestion } from '@/lib/actions/user.action';
import React from 'react';
import QuestionCard from '../cards/QuestionCard';
import Pagination from './Pagination';

interface Props {
    userId: string;
    clerkId: string;
    SearchParams?: { [key: string]: string | undefined };
}

const QuestionTab = async ({ userId, clerkId, SearchParams }: Props) => {
    const result = await getUserQuestion({
        userId,
        page: SearchParams?.page ? +SearchParams.page : 1,
    });

    return (
        <>
            {result.questions.length > 0 ? (
                result.questions.map((question) => (
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
                ))
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-5">
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        🤔 No questions found!
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Be the first to ask something insightful.
                    </p>
                </div>
            )}

            {result?.questions.length > 0 && (
                <div className="mt-10">
                    <Pagination
                        pageNumber={SearchParams?.page ? +SearchParams.page : 1}
                        isNext={result?.isNext}
                    />
                </div>
            )}
        </>
    );
};

export default QuestionTab;
