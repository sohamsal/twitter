"use client"
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Replies from "@/components/Replies"; // Add this line
import { Tweet } from "@/interfaces/interfaces"
import Engagement from "@/components/Engagement";
import ReplyBox from "@/components/ReplyBox";
import AuthButton from "@/components/AuthButton";

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

    async function fetchUser() {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        return user;
    }

    const deleteTweet = async (tweet_id: number, who_posted: any) => {
        const username = await fetchUser()
        if (username && (who_posted.user.img == username.user_metadata.avatar_url)) {
            console.log(username)
            const { error } = await supabase.from('tweets').delete().eq('tweet_id', tweet_id);
            await supabase.from('liked_posts').delete().eq('post_id', tweet_id);

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
        <div className="flex-1 w-full flex flex-col items-center bg-black text-white dark:[color-scheme:dark]">
            {tweetData.length > 0 && tweetData[0].tweet_content.length > 0 ? (
                <div className="flex-col w-1/3 justify-center pt-24 mb-10 text-4xl">
                    <img src={tweetData[0].who_posted.user.img} alt="User Profile" className="rounded-full h-16 w-16 mb-2" />
                    <div className="flex flex-row justify-between"> 
                        <h2 className="font-bold mt-1">{tweetData[0].who_posted.user.name}</h2>
                        <button className="text-sm bg-purple-600 p-3 rounded-md hover:bg-purple-800" onClick={() => deleteTweet(tweetData[0].tweet_id, tweetData[0].who_posted)}>Delete</button> 
                    </div>
                    <p className="text-2xl font-light">{tweetData[0].tweet_content}</p>
                    <p className="text-gray-500 text-sm">{readableDate(tweetData[0])}</p>
                    <Engagement tweetId={tweetData[0].tweet_id} />
                    <h1 className="font-semibold text-4xl pt-5 text-purple-600">Replies</h1>
                    <ReplyBox tweet = {tweetData[0]}/>
                    <Replies tweet={tweetData[0]} />
                </div>
            ) : (
                <p className="text-white flex justify-center m-auto">Tweet doesn't exist</p>
            )}
        </div>
    );
}