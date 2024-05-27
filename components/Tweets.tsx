"use client"
import { createClient } from "@/utils/supabase/client";
import { tweetId } from "@/components/actions/action";
import { useEffect, useState } from "react";
import { Tweet } from "@/interfaces/interfaces"
import Engagement from "./Engagement";

export default function Tweets() {
    const supabase = createClient();
    const table = 'tweets';
    const [tweetData, setTweetData] = useState<Tweet[]>([]);

    async function fetchUser() {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        return user;
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const { data, error } = await supabase.from(table).select('tweet_id, created_at, who_posted, tweet_content, parent');

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
        <div>
            {tweetData.length > 0 ? (
                <div className="flex-col justify-center dark:[color-scheme:dark]">
                    {tweetData.map(tweet => (
                        <div className="p-4 w-11/12 sm:w-96 bg-slate-900 mb-6 cursor-default mx-4 sm:mx-8 md:mx-16 lg:mx-24" key={tweet.tweet_id} >
                            <img src={tweet.who_posted.user.img} alt="User Profile" className="rounded-full h-8 w-8" />
                            <p className="font-bold mt-1">{tweet.who_posted.user.name}</p>
                            {tweet.parent && <p onClick={() => tweetId(tweet.parent)} className="text-gray-500 text-sm underline cursor-pointer">replied to {tweet.who_posted.user.name + "'s post"}</p>}
                            <p className="cursor-pointer" onClick={() => tweetId(tweet.tweet_id)}>{tweet.tweet_content}</p>
                            <p onClick={() => tweetId(tweet.tweet_id)} className="text-gray-500 text-sm cursor-pointer">{readableDate(tweet)}</p>
                            <Engagement tweetId={tweet.tweet_id} />
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>

    );
}