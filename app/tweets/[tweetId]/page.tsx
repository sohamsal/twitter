"use client"
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface User {
    img: string;
    link: string;
    name: string;
}

interface Tweet {
    tweet_id: number;
    created_at: string;
    who_posted: { user: User };
    tweet_content: string;
}

export default function TweetsPage({ params }: { params: { tweetId: string } }) {
    const supabase = createClient();
    const [tweetData, setTweetData] = useState<Tweet[]>([]);

    useEffect(() => { fetchData() }, []);

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

    async function fetchData() {
        const { data, error } = await supabase.from('tweets').select('tweet_id, created_at, who_posted, tweet_content').filter('tweet_id', 'eq', params.tweetId);

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            setTweetData(data as unknown as Tweet[]);
        }
    }

    return (
        <div className="flex-1 w-full flex flex-col items-center bg-black text-white dark:[color-scheme:dark]">
            {tweetData.length > 0 && tweetData[0].tweet_content.length > 0 ? (
                <div className="flex-col justify-center p-36 text-4xl">
                    <img src={tweetData[0].who_posted.user.img} alt="User Profile" className="rounded-full h-16 w-16" />
                    <h2 className="font-bold mt-1">{tweetData[0].who_posted.user.name}</h2>
                    <p className="text-2xl">{tweetData[0].tweet_content}</p>
                    <p className="text-gray-500 text-sm">{readableDate(tweetData[0])}</p>
                </div>
            ) : (
                <p className="text-white flex justify-center m-auto">Tweet doesn't exist</p>
            )}
        </div>
    );
}