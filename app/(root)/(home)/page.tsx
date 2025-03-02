import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilters from '@/components/home/HomeFilters'
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import { getQuestions, getRecommendedQuestions } from '@/lib/actions/question.action'
import Link from 'next/link'
import React from 'react'
import Pagination from '../../../components/shared/Pagination'
import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'

export const metadata: Metadata = {
    title: 'Home | CodeSphere',
    description: 'CodeSphere is a community of great developers and programmers. Join us and enhance your learning experience'
}

const Home = async (props: { searchParams?: Promise<Record<string, string>> }) => {
    const searchParams = await props.searchParams;

    const searchQuery = searchParams?.q || '';
    const searchFilter = searchParams?.filter || '';

    const { userId } = await auth()

    let result;
    if (searchFilter === 'recommended') {
        if (userId) {
            result = await getRecommendedQuestions({
                userId,
                searchQuery: searchQuery,
                page: searchParams?.page ? +searchParams.page : 1
            });
        } else {
            result = {
                questions: [],
                isNext: false
            }
        }
    } else {
        result = await getQuestions({
            searchQuery: searchQuery,
            filter: searchFilter,
            page: searchParams?.page ? +searchParams.page : 1
        });
    }



    return (
        <>
            <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
                <h1 className='h1-bold text-dark100_light900'>All Questions</h1>
                <Link href='/ask-question' className='flex justify-end max-sm:w-full'>
                    <Button className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>
                        Ask a Question
                    </Button>
                </Link>
            </div>
            <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center '>
                <LocalSearchbar
                    route='/'
                    iconPosition='left'
                    imgSrc='/assets/icons/search.svg'
                    placeholder='Search for questions'
                    otherClasses='flex-1'
                />

                <Filter
                    filters={HomePageFilters}
                    otherClasses='min-h-[56px] sm:min-w-[170px]'
                    containerClasses='hidden max-md:flex'
                />
            </div>
            <HomeFilters />

            <div className='mt-10 flex w-full gap-6 flex-col'>
                {result?.questions.length! > 0 ? (result?.questions?.map((question) => (
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
                    title="There's no questions to show"
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

export default Home
