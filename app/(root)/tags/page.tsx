import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { TagFilters } from '@/constants/filters'
import { getAllTags } from '@/lib/actions/tag.action'
import Link from 'next/link'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tags | CodeSphere',
}

const Page = async (props: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
    const searchParams = await props.searchParams;

    const searchQuery = searchParams?.q || '';
    const searchFilter = searchParams?.filters || '';


    const result = await getAllTags({
        searchQuery: searchQuery,
        filter: searchFilter,
        page: searchParams?.page ? +searchParams.page : 1
    })

    return (
        <>
            <h1 className='h1-bold text-dark100_light900'>All Tags</h1>
            <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center '>
                <LocalSearchbar
                    route='/tags'
                    iconPosition='left'
                    imgSrc='/assets/icons/search.svg'
                    placeholder='Search for tags'
                    otherClasses='flex-1'
                />

                <Filter
                    filters={TagFilters}
                    otherClasses='min-h-[56px] sm:min-w-[170px]'
                />
            </div>
            <section className='mt-12 flex flex-wrap gap-4'>
                {result.tags.length > 0 ? result.tags?.map((tag) => (
                    <Link
                        href={`/tags/${tag._id}`}
                        key={tag._id}
                        className='shadow-light200_darknone flex justify-between gap-2'>
                        <article className='background-light900_dark200 light-border flex flex-col w-full rounded-2xl border px-8 py-10 sm:w-[240px]'>
                            <div className='background-light800_dark400 w-fit rounded-sm px-5 py-1.5'>
                                <p className='paragraph-semibold text-dark300_light900 line-clamp-1'>{tag.name}</p>
                            </div>
                            <p className='small-medium text-dark400_light500 mt-3.5'>
                                <span className='body-semibold primary-text-gradient mr-2.5'>{tag.questions.length}</span>Questions
                            </p>

                        </article>
                    </Link>
                )) : (
                    <NoResult
                        title='No Tags Found'
                        description='It looks like there are no tags yet. Be the first to create one! by asking a question'
                        link='/ask-question'
                        linkTitle='Ask a Question'
                    />
                )}
            </section>
            <div className='mt-10'>
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result?.isNext}
                />
            </div>
        </>
    )
}

export default Page
