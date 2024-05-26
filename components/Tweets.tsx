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
        const { data, error } = await supabase.from(table).select('tweet_id, created_at, who_posted, tweet_content');

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

    const deleteTweet = async (tweet_id: number, who_posted: any) => {
        const username = await fetchUser()
        if (username && (who_posted.user.img == username.user_metadata.avatar_url)) {
            console.log(username)
            const { error } = await supabase.from(table).delete().eq('tweet_id', tweet_id);

            if (error) {
                console.error('Error deleting tweet:', error);
            } else {
                console.log('Deleted tweet:', tweet_id);
                fetchData();
            }
        } else {
            alert("bros tryna delete someone else's tweet")
        }
    };

    return (
        <div>
            {tweetData.length > 0 ? (
                <div className="flex-col justify-center dark:[color-scheme:dark]">
                    {tweetData.map(tweet => (
                        <div className="p-4 w-96 bg-slate-900 mb-6" key={tweet.tweet_id}>
                            <img src={tweet.who_posted.user.img} alt="User Profile" className="rounded-full h-8 w-8" />
                            <p className="font-bold mt-1">{tweet.who_posted.user.name}</p>
                            <p>{tweet.tweet_content}</p>
                            <p className="text-gray-500 text-sm">{readableDate(tweet)}</p>
                            <button className="bg-red" onClick={() => deleteTweet(tweet.tweet_id, tweet.who_posted)}>Delete</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}