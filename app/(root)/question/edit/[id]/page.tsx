import Question from '@/components/forms/Question'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const Page = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const questionId = params?.id

    const { userId } = await auth()
    if (!userId) return null;

    const mongoUser = await getUserById({ userId })
    const result = await getQuestionById({ questionId: questionId })

    return (
        <>
            <h1 className='h1-bold text-dark100_light900'>Edit Question</h1>

            <div className='mt-9'>
                <Question
                    type='Edit'
                    mongoUserId={mongoUser._id.toString()}
                    questionDetails={JSON.stringify(result)}
                />
            </div>
        </>
    )
}

export default Page
