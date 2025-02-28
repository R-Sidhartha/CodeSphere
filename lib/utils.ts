import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import queryString from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
};

// export const formatNumber = (num: number): string => {
//   if (num >= 1_000_000_000) {
//     return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B"; // Billion
//   }
//   if (num >= 1_000_000) {
//     return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"; // Million
//   }
//   if (num >= 1_000) {
//     return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K"; // Thousand
//   }
//   return num.toString(); // If less than 1K, return as is
// };

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${parseFloat((num / 1_000_000_000).toFixed(1))}B`; // Billion
  }
  if (num >= 1_000_000) {
    return `${parseFloat((num / 1_000_000).toFixed(1))}M`; // Million
  }
  if (num >= 1_000) {
    return `${parseFloat((num / 1_000).toFixed(1))}K`; // Thousand
  }
  return num.toString(); // If less than 1K, return as is
};

export const parseJoinedDate = (dateString: Date | string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options).replace(",", "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = queryString.parse(params);

  currentUrl[key] = value;

  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}
export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = queryString.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};
