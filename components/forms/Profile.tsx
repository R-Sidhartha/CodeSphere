'use client';

import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea'
import { ProfileSchema } from '@/lib/validations'
import { usePathname, useRouter } from 'next/navigation'
import { updateUser } from '@/lib/actions/user.action'

interface Props {
    clerkId: string;
    user: string;
}


const Profile = ({ clerkId, user }: Props) => {
    const [isSubmitting, setisSubmitting] = useState(false);
    const parsedUser = JSON.parse(user);
    const router = useRouter();
    const pathname = usePathname()

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: parsedUser.name || "",
            username: parsedUser.username || "",
            portfoliowebsite: parsedUser.portfoliowebsite || "",
            location: parsedUser.location || "",
            bio: parsedUser.bio || "",
        },
    })

    async function onSubmit(values: z.infer<typeof ProfileSchema>) {
        setisSubmitting(true);
        try {
            await updateUser({
                clerkId,
                updateData: {
                    name: values.name,
                    username: values.username,
                    portfoliowebsite: values.portfoliowebsite,
                    location: values.location,
                    bio: values.bio
                },
                path: pathname

            })
            router.back();
        } catch (error) {
            console.log(error);
        } finally {
            setisSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-9 flex w-full flex-col gap-9">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className='space-y-3.5'>
                            <FormLabel className='paragraph-semibold'>Name<span className='text-primary-500'>*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className='space-y-3.5'>
                            <FormLabel className='paragraph-semibold' >UserName<span className='text-primary-500'>*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="Your Username" {...field} className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px]' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="portfoliowebsite"
                    render={({ field }) => (
                        <FormItem className='space-y-3.5'>
                            <FormLabel className='paragraph-semibold'>Portfolio Link</FormLabel>
                            <FormControl>
                                <Input type='url' placeholder="https://example.com" {...field} className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px]' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem className='space-y-3.5'>
                            <FormLabel className='paragraph-semibold'>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="Your City" {...field} className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px]' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className='space-y-3.5'>
                            <FormLabel className='paragraph-semibold'>Bio</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe yourself" {...field} className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px]' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='mt-7 flex justify-end'>
                    <Button type="submit" className='primary-gradient w-fit' disabled={isSubmitting}>{isSubmitting ? "Saving" : "Save"}</Button>
                </div>

            </form>
        </Form>
    )
}

export default Profile
