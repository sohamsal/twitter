"use client"
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { tweetId } from "@/components/actions/action";
import { Tweet } from "@/interfaces/interfaces"
import Engagement from "./Engagement";


// interface User {
//     img: string;
//     link: string;
//     name: string;
// }

// interface Tweet {
//     tweet_id: number;
//     created_at: string;
//     who_posted: { user: User };
//     tweet_content: string;
//     parent: number;
// }


export default function Replies({ tweet }: { tweet: Tweet }) {
    const [tweetData, setTweetData] = useState<Tweet[]>([]);
    const supabase = createClient();
    const table = 'tweets';

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const { data, error } = await supabase.from(table)
        .select('tweet_id, created_at, who_posted, tweet_content, parent')
        .filter('parent', 'eq', tweet.tweet_id);

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            setTweetData(data as unknown as Tweet[]);
        }
    }

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const readableDate = (tweet: Tweet): string => {
        return (formatDate(tweet.created_at));
    };

    return (
        <>
            {tweetData.length > 0 ? (
                <div className="flex-col justify-center text-sm pt-4">
                    {tweetData.map(tweet => (
                        <div className="p-4 w-full bg-slate-900 mb-6 cursor-default" key={tweet.tweet_id} >
                            <img src={tweet.who_posted.user.img} alt="User Profile" className="rounded-full h-8 w-8" />
                            <p className="font-bold mt-1 text-lg">{tweet.who_posted.user.name}</p>
                            <p className="cursor-pointer" onClick={() => tweetId(tweet.tweet_id)}>{tweet.tweet_content}</p>
                            <p onClick={() => tweetId(tweet.tweet_id)} className="text-gray-500 text-sm cursor-pointer">{readableDate(tweet)}</p>
                            <Engagement tweetId={tweet.tweet_id} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 pt-2 flex justify-center">no replies yet!</p>
            )}
        </>
    )
}