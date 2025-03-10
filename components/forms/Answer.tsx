'use client';
import React, { useRef, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AnswerSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { useTheme } from '@/context/ThemeProvider'
import { Button } from '../ui/button'
import Image from 'next/image'
import { CreateAnswer } from '@/lib/actions/answer.action'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner';

interface Props {
    questionId: string;
    authorId: string;
    questionTitle: string;
    questionContent: string;
}
const Answer = ({ questionId, authorId, questionTitle, questionContent }: Props) => {

    const pathname = usePathname()
    const { mode } = useTheme();
    const [isSubmitting, setisSubmitting] = useState(false);
    const [isSubmittingAI, setisSubmittingAI] = useState(false);
    const editorRef = useRef(null)
    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {
            answer: ''
        }
    })
    const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
        if (!authorId) {
            toast.error("Please log in", {
                description: "You must be logged in to Answer.",
            });
            if (editorRef.current) {
                const editor = editorRef.current as any;
                editor.setContent('')
            }
            return;
        }
        setisSubmitting(true);
        try {

            await CreateAnswer({
                content: values.answer,
                author: authorId,
                question: questionId,
                path: pathname
            })

            form.reset();

            if (editorRef.current) {
                const editor = editorRef.current as any;
                editor.setContent('')
            }
        } catch (error) {
            console.log('Error while creating answer', error)
        } finally {
            setisSubmitting(false)
        }
    }

    const generateAIAnswer = async () => {
        if (!authorId) {
            return;
        }

        setisSubmittingAI(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
                method: 'POST',
                body: JSON.stringify({ questionTitle, questionContent })
            })

            if (!response.ok) {
                throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
            }

            const aiAnswer = await response.json();
            if (aiAnswer?.reply) {
                const formattedAnswer = aiAnswer.reply.replace(/\n/g, '<br/>')
                if (editorRef.current) {
                    const editor = editorRef.current as any;
                    editor.setContent(formattedAnswer)
                }
            } else {
                console.error("No reply received from AI.");
            }
        } catch (error) {
            console.log(error)
        } finally {
            setisSubmittingAI(false);
        }
    }

    return (
        <div>
            <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2 mt-4'>
                <h4 className='paragraph-semibold text-dark400_light800'>Write your answers here</h4>
                <Button className='btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500'
                    onClick={generateAIAnswer}>
                    {isSubmittingAI ? (
                        <>
                            Generating...
                        </>
                    ) : (
                        <>
                            <Image
                                src='/assets/icons/stars.svg'
                                alt='stars'
                                width={12}
                                height={12}
                                className='object-contain'
                            />
                            Generate an AI answer
                        </>
                    )}
                </Button>
            </div>
            <Form {...form}>
                <form action="" className='mt-6 flex w-full flex-col gap-10'
                    onSubmit={form.handleSubmit(handleCreateAnswer)}
                >
                    <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-3">
                                <FormControl className="mt-3.5">
                                    <Editor
                                        apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                                        onInit={(_evt, editor) => editorRef.current = editor}
                                        onBlur={field.onBlur}
                                        onEditorChange={(content) => field.onChange(content)}
                                        // initialValue=""
                                        init={{
                                            height: 350,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'codesample | bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist',
                                            content_style: 'body { font-family:Inter; font-size:16px }',
                                            skin: mode === "dark" ? "oxide-dark" : "oxide",
                                            content_css: mode === "dark" ? "dark" : "light",
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-end'>
                        <Button
                            type="submit"
                            className='primary-gradient w-fit text-white'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>

                    </div>
                </form>

            </Form>
        </div>

    )
}

export default Answer
