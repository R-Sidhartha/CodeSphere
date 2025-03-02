import { Button } from '@/components/ui/button';
import { getUserInfo } from '@/lib/actions/user.action';
import { SignedIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { parseJoinedDate } from '@/lib/utils';
import ProfileLink from '@/components/shared/ProfileLink';
import Stats from '@/components/shared/Stats';
import QuestionTab from '@/components/shared/QuestionTab';
import AnswersTab from '@/components/shared/AnswersTab';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Profile | CodeSphere',
}

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<Record<string, string>>;
}

const Page = async ({ params, searchParams }: PageProps) => {
    const Params = await params;
    const SearchParams = await searchParams;


    const { userId: clerkId } = await auth()

    const userId = Params?.id

    const userInfo = await getUserInfo({ userId: userId })
    return (
        <>
            <div className='flex flex-col-reverse items-stat justify-between sm:flex-row'>
                <div className='flex flex-col items-start gap-4 lg:flex-row'>
                    <Image
                        src={userInfo?.user.picture}
                        alt='profile picture'
                        width={140}
                        height={140}
                        className='rounded-full object-cover'
                    />

                    <div className='mt-3'>
                        <h2 className='h2-bold text-dark100_light900'>{userInfo?.user.name}</h2>
                        <p className='paragraph-regular text-dark200_light800'>@{userInfo?.user.username}</p>
                        <div className='mt-5 flex flex-wrap items-center justify-start gap-5'>
                            {userInfo?.user.portfoliowebsite && (
                                <ProfileLink
                                    imgUrl='/assets/icons/link.svg'
                                    href={userInfo?.user.portfoliowebsite}
                                    title='Portfolio'
                                />
                            )}
                            {userInfo?.user.location && (
                                <ProfileLink
                                    imgUrl='/assets/icons/location.svg'
                                    title={userInfo?.user.location}
                                />
                            )}
                            <ProfileLink
                                imgUrl='/assets/icons/calendar.svg'
                                title={parseJoinedDate(userInfo.user.joinedAt.toString())}
                            />

                        </div>
                        {userInfo?.user.bio && (
                            <p className='paragraph-regular text-dark400_light800 mt-8'>{userInfo.user.bio}</p>
                        )}
                    </div>
                </div>
                <div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
                    <SignedIn>
                        {clerkId === userInfo.user.clerkId && (
                            <Link
                                href={'/profile/edit'}
                            >
                                <Button className='paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3'>
                                    Edit Profile
                                </Button>

                            </Link>
                        )}
                    </SignedIn>
                </div>
            </div>

            <Stats
                reputation={userInfo.reputation}
                totalQuestions={userInfo?.totalQuestions}
                totalAnswers={userInfo?.totalAnswers}
                badges={userInfo?.badgeCounts}
            />

            <div className='mt-10 flex gap-10'>
                <Tabs defaultValue='top-posts' className='flex-1'>
                    <TabsList className='background-light800_dark400 min-h-[42px] p-1'>
                        <TabsTrigger value="top-posts" className='tab'>Top Posts</TabsTrigger>
                        <TabsTrigger value="answers" className='tab'>Answers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="top-posts" className='mt-5 flex w-full flex-col gap-6'>
                        <QuestionTab
                            SearchParams={SearchParams}
                            userId={userInfo?.user._id}
                            clerkId={userId}
                        /></TabsContent>
                    <TabsContent value="answers">
                        <AnswersTab
                            SearchParams={SearchParams}
                            userId={userInfo?.user._id}
                            clerkId={userId}
                        />
                    </TabsContent>
                </Tabs>

            </div>
        </>
    )
}

export default Page
