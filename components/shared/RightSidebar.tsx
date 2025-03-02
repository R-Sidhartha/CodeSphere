import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";

const RightSidebar = async () => {
    const hotQuestions = await getHotQuestions();
    const popularTags = await getPopularTags();

    return (
        <section className="background-light900_dark200 light-border sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-ligh-300 dark:shadow-none max-xl:hidden w-[350px] custom-scrollbar">
            <div>
                <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                {hotQuestions.length > 2 ? (
                    <div className="mt-7 flex w-full flex-col gap-[30px]">
                        {hotQuestions.map((question) => (
                            <Link
                                href={`/question/${question._id}`}
                                key={question._id}
                                className="flex cursor-pointer items-center justify-between gap-7 hover:bg-light-300 dark:hover:bg-dark-300 rounded-lg px-4 py-2 transition"
                            >
                                <p className="body-medium text-dark500_light700">
                                    {question.title}
                                </p>
                                <Image
                                    src="/assets/icons/chevron-right.svg"
                                    alt="chevron right"
                                    width={20}
                                    height={20}
                                    className="invert-colors"
                                />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="mt-5 text-gray-500 dark:text-gray-400 text-sm italic">
                        🚀 No trending questions yet. Be the first to ask something great!
                    </p>
                )}
            </div>

            <div className="mt-16">
                <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
                {popularTags.length > 3 ? (
                    <div className="mt-7 flex flex-col gap-4">
                        {popularTags.map((tag) => (
                            <RenderTag
                                key={tag._id}
                                _id={tag._id}
                                name={tag.name}
                                totalQuestions={tag.numberOfQuestions}
                                showCount
                            />
                        ))}
                    </div>
                ) : (
                    <p className="mt-5 text-gray-500 dark:text-gray-400 text-sm italic">
                        🔖 No popular tags yet. Start tagging your questions!
                    </p>
                )}
            </div>
        </section>
    );
};

export default RightSidebar;
