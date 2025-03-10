'use client'

import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
    filters: {
        name: string,
        value: string,
    }[];
    otherClasses?: string;
    containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {

    const searchParams = useSearchParams();
    const router = useRouter();
    const paramFilter = searchParams.get('filter')

    const handleUpdateParams = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'filters',
            value
        })

        router.push(newUrl, { scroll: false })
    }
    return (
        <div className={`relative ${containerClasses}`}>
            <Select
                onValueChange={handleUpdateParams}
                defaultValue={paramFilter || undefined}
            >
                <SelectTrigger className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2`}>
                    <div className='flex-1 text-left line-clamp-1'>
                        <SelectValue placeholder="Select a Filter" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {filters.map((filter) => (
                            <SelectItem key={filter.value} value={filter.value}>
                                {filter.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default Filter
