"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { User } from "@/interfaces/interfaces"

const TweetBox: React.FC = () => {
    const supabase = createClient();
    const table = 'tweets';
    const [tweet, setTweet] = useState('');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setUser({
                    img: user.user_metadata.picture,
                    link: '',
                    name: user.user_metadata.full_name,
                });
            }
        };

        fetchUser();
    }, []);

    const handleTweet = async () => {
        if (user) {
            const { data, error } = await supabase.from(table).insert([
                {
                    who_posted: {
                        user: {
                            img: user.img,
                            link: user.link,
                            name: user.name,
                        },
                    },
                    tweet_content: tweet,
                }
            ]);

            if (error) {
                console.error('Error inserting tweet:', error);
            } else {
                console.log('Tweeted:', data);
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
        <div className='flex flex-col'>
            <h2 className='text-lg font-semibold pb-2'>Write what's on your mind</h2>
            <textarea
                className="bg-gray-900 w-96 h-24 rounded-md border-white border-2 placeholder-neutral-500 align-text-top p-2"
                placeholder='Type your tweet here'
                value={tweet}
                onChange={handleChange}
            />
            <button
                className="bg-purple-500 text-white px-4 p-2 rounded-md mt-2 hover:bg-purple-800"
                onClick={handleTweet}
            >
                Tweet
            </button>
        </div>
    );
};

export default TweetBox;
