
import QuestionCard from '@/components/cards/QuestionCard';
import NoResult from '@/components/shared/NoResult';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
// import { IQuestion } from '@/database/models/qustion.model';
import { getQuestionsByTagId } from '@/lib/actions/tag.action'
import React from 'react'

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<Record<string, string>>;
}

const Page = async ({ params, searchParams }: PageProps) => {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const searchQuery = resolvedSearchParams?.q || '';


    const tagId = resolvedParams?.id
    const result = await getQuestionsByTagId({
        tagId: tagId,
        page: 1,
        searchQuery: searchQuery
    })


    return (
        <>
            <h1 className='h1-bold text-dark100_light900'>{result.tagTitle}</h1>

            <div className='mt-11 w-full'>
                <LocalSearchbar
                    route={`/tags/${tagId}`}
                    iconPosition='left'
                    imgSrc='/assets/icons/search.svg'
                    placeholder='Search for tag questions'
                    otherClasses='flex-1'
                />
            </div>

            <div className='mt-10 flex w-full gap-6 flex-col'>
                {(result.questions ?? []).length > 0 ? (result.questions?.map((question: any) => (
                    <QuestionCard
                        key={question._id}
                        _id={question._id}
                        title={question.title}
                        tags={question.tags}
                        author={question.author}
                        upvotes={question.upvotes}
                        views={question.views}
                        answers={question.answers}
                        createdAt={question.createdAt}
                    />
                ))) : <NoResult
                    title="There's no tag questions to show"
                    description='BE the first to break the silense! Ask a question and kickstart the discussion. ou query could be the next big thing others learn from. Get involved'
                    link='/ask-question'
                    linkTitle='Ask a Question'
                />}
            </div>
        </>
    )
}

export default Page
