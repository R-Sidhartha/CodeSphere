import QuestionCard from '@/components/cards/QuestionCard'
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { QuestionFilters } from '@/constants/filters'
import { getSavedQuestions } from '@/lib/actions/user.action'
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Collections | CodeSphere',
}

const Collection
    = async (props: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {

        const searchParams = await props.searchParams;

        const searchQuery = searchParams?.q || '';
        const searchFilter = searchParams?.filters || '';

        const { userId } = await auth();

        if (!userId) {
            return (
                <NoResult
                    title="You have to be logged in to Save or View your collection"
                    description='Unlock the full experience! Log in to save questions and access your collection seamlessly. Keep track of valuable discussions and never lose sight of the knowledge that matters to you.'
                    link='/sign-in'
                    linkTitle='Log In'
                />
            )
        }

        const result = await getSavedQuestions({
            clerkId: userId,
            searchQuery: searchQuery,
            filter: searchFilter,
            page: searchParams?.page ? +searchParams.page : 1
        });

        return (
            <>
                <h1 className='h1-bold text-dark100_light900'>Saved Questions</h1>

                <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center '>
                    <LocalSearchbar
                        route='/collection'
                        iconPosition='left'
                        imgSrc='/assets/icons/search.svg'
                        placeholder='Search for questions'
                        otherClasses='flex-1'
                    />

                    <Filter
                        filters={QuestionFilters}
                        otherClasses='min-h-[56px] sm:min-w-[170px]'
                    />
                </div>

                <div className='mt-10 flex w-full gap-6 flex-col'>
                    {result.savedQuestion.length > 0 ? (result.savedQuestion?.map((question: any) => (
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
                        title="There's no saved questions to show"
                        description='BE the first to break the silense! Ask a question and kickstart the discussion. ou query could be the next big thing others learn from. Get involved'
                        link='/ask-question'
                        linkTitle='Ask a Question'
                    />}
                </div>
                <div className='mt-10'>
                    <Pagination
                        pageNumber={searchParams?.page ? +searchParams.page : 1}
                        isNext={result?.isNext}
                    />
                </div>
            </>
        )
    }

export default Collection

