"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Tweet, User } from "@/interfaces/interfaces"

export function ReplyBox({ tweet }: { tweet: Tweet }) {
    const supabase = createClient();
    const table = 'tweets';
    const [user, setUser] = useState<User | null>(null);
    const [tweetData, setTweet] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const emailParts = user.email ? user.email.split('@') : [];
                setUser({
                    img: user.user_metadata.picture,
                    link: '',
                    name: user.user_metadata.full_name,
                    username: emailParts[0],
                });
            }
        };

        fetchUser();
    }, []);

    const handleTweet = async () => {
        if (user && tweetData.length > 0) {
            const { data, error } = await supabase.from(table).insert([
                {
                    who_posted: {
                        user: {
                            img: user.img,
                            link: user.link,
                            name: user.name,
                            username: user.username,
                        },
                    },
                    tweet_content: tweetData,
                    parent: tweet.tweet_id,
                }
            ]);


            if (error) {
                console.error('Error inserting tweet:', error);
            } else {
                console.log('Tweeted:', data);
                await supabase.rpc('add_replies', { id: tweet.tweet_id });
                setTweet(''); 
            }
        } else {
            console.error('User not found');
        }

    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };

    return (
        <div className='flex flex-col my-3'>
            <textarea
                className="bg-gray-900 h-12 rounded-md border-white border-2 placeholder-neutral-500 align-text-top p-2 text-sm"
                placeholder='Type your tweet here'
                value={tweetData}
                onChange={handleChange}
            />
            <button
                className="bg-purple-600 text-white px-4 p-2 rounded-md mt-2 hover:bg-purple-800 text-sm"
                onClick={handleTweet}
            >
                Reply
            </button>
        </div>
    );
};

export default ReplyBox;
