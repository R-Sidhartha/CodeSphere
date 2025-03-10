import UserCard from '@/components/cards/UserCard'
import Filter from '@/components/shared/Filter'
import Pagination from '@/components/shared/Pagination'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { UserFilters } from '@/constants/filters'
import { getAllUsers } from '@/lib/actions/user.action'
import Link from 'next/link'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Community | CodeSphere',
}

const Page = async (props: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {

    // const { page = '1', filters = '', q = '' } = await props.searchParams
    const searchQuery = (await props.searchParams).q
    const searchFilter = (await props.searchParams).filters
    const page = (await props.searchParams).page

    // const searchParams = await props.searchParams;

    // const searchQuery = searchParams?.q || '';
    // const searchFilter = searchParams?.filters || '';

    // const result = await getAllUsers({
    //     searchQuery: searchQuery,
    //     filter: searchFilter,
    //     page: searchParams?.page ? +searchParams.page : 1
    // })
    const result = await getAllUsers({
        searchQuery: searchQuery,
        filter: searchFilter,
        page: page ? +page : 1
    })


    return (
        <>
            <h1 className='h1-bold text-dark100_light900'>All Users</h1>
            <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center '>
                <LocalSearchbar
                    route='/community'
                    iconPosition='left'
                    imgSrc='/assets/icons/search.svg'
                    placeholder='Search for amazing minds'
                    otherClasses='flex-1'
                />

                <Filter
                    filters={UserFilters}
                    otherClasses='min-h-[56px] sm:min-w-[170px]'
                />
            </div>
            <section className='mt-12 flex flex-wrap gap-4'>
                {result?.users.length > 0 ? result?.users?.map((user) => (
                    <UserCard
                        key={user._id}
                        user={user}
                    />
                )) : (
                    <div className='paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center'>
                        <p>No Users yet</p>
                        <Link href={'/sign-up'} className='mt-2 font-bold text-accent-blue'>
                            Join to be the first!
                        </Link>

                    </div>
                )}
            </section>
            <div className='mt-10'>
                <Pagination
                    pageNumber={page ? +page : 1}
                    // pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result?.isNext}
                />
            </div>
        </>
    )
}

export default Page
