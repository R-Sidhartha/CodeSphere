import QuestionCard from '@/components/cards/QuestionCard'
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { QuestionFilters } from '@/constants/filters'
import { getSavedQuestions } from '@/lib/actions/user.action'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const Collection
    = async (props: { searchParams?: Promise<Record<string, string>> }) => {

        const searchParams = await props.searchParams;

        const searchQuery = searchParams?.q || '';

        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        const questions = await getSavedQuestions({
            clerkId: userId,
            searchQuery: searchQuery
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
                    {(questions ?? []).length > 0 ? (questions?.map((question: any) => (
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
            </>
        )
    }

export default Collection

