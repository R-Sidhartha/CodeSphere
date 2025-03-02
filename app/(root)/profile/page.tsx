import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const Page = async () => {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        redirect("/sign-in");
    }

    return (
        <div className="flex min-h-screen items-center justify-center ">
            <div className="max-w-md w-full rounded-xl bg-white p-8 shadow-lg dark:bg-dark-800 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sign In Required
                </h2>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                    Please sign in to access your profile and manage your account.
                </p>
                <Link
                    href="/sign-in"
                    className="mt-5 inline-block w-full rounded-lg bg-blue-600 px-5 py-2.5 text-white font-semibold shadow-md hover:bg-blue-700 transition-all"
                >
                    Sign In Now
                </Link>
            </div>
        </div>
    );
};

export default Page;
