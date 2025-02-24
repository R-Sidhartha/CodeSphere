import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilters from '@/components/home/HomeFilters'
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import Link from 'next/link'
import React from 'react'

const questions = [
    {
        _id: "1",
        title: "How to optimize React app performance?",
        tags: [
            { _id: "1", name: "React" },
            { _id: "2", name: "Performance" },
            { _id: "3", name: "Optimization" }
        ],
        author: {
            _id: "101",
            name: "John Doe",
            picture: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        upvotes: 25,
        views: 340,
        answers: [
            { _id: "201", content: "Use React.memo and optimize re-renders." },
            { _id: "202", content: "Consider using useCallback and useMemo hooks." }
        ],
        createdAt: new Date("2024-02-20T10:30:00Z")
    },
    {
        _id: "2",
        title: "What are JavaScript closures?",
        tags: [
            { _id: "4", name: "JavaScript" },
            { _id: "5", name: "Closures" }
        ],
        author: {
            _id: "102",
            name: "Jane Smith",
            picture: "https://randomuser.me/api/portraits/women/2.jpg"
        },
        upvotes: 4200,
        views: 55000,
        answers: [
            { _id: "203", content: "Closures allow functions to retain access to their lexical scope." },
            { _id: "204", content: "Useful for data encapsulation and function factories." }
        ],
        createdAt: new Date("2025-02-24T10:30:20Z")
    }
]

const Home = () => {
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
                {questions.length > 0 ? (questions?.map((question) => (
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
        </>
    )
}

export default Home
