'use client'

import { HomePageFilters } from '@/constants/filters'
import React from 'react'
import { Button } from '../ui/button'

const HomeFilters = () => {
    const active = 'newest';

    return (
        <div className='mt-10 flex-wrap gap-3 md:flex hidden'>
            {HomePageFilters.map((filter) => (
                <Button key={filter.value} onClick={() => { }}
                    className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${active === filter.value ? 'bg-primary-100 text-primary-500' : 'bg-light-800 text-light-500 hover:bg-light-900 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-200'} `}
                >
                    {filter.name}
                </Button>
            ))}
        </div>
    )
}

export default HomeFilters
