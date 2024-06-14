import { tweetId } from "@/components/actions/action";
import Engagement from "./Engagement";
import { Tweet } from "@/interfaces/interfaces";

const TweetCard = ({ tweet }: { tweet: Tweet }) => {
    const readableDate = (timestamp: string) => {
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

    return (
        <div className="p-4 w-11/12 sm:w-96 bg-slate-900 mb-6 cursor-default mx-4 sm:mx-8 md:mx-16 lg:mx-24">
            <img src={tweet.who_posted.user.img} alt="User Profile" className="rounded-full h-8 w-8" />
            <p className="font-bold mt-1">{tweet.who_posted.user.name}</p>
            {tweet.parent && (
                <p onClick={() => tweetId(tweet.parent)} className="text-gray-500 text-sm underline cursor-pointer">
                    replied to {tweet.parent || 'loading'}'s post
                </p>
            )}
            <p className="cursor-pointer" onClick={() => tweetId(tweet.tweet_id)}>{tweet.tweet_content}</p>
            <p onClick={() => tweetId(tweet.tweet_id)} className="text-gray-500 text-sm cursor-pointer">{readableDate(tweet.created_at)}</p>
            <Engagement tweetId={tweet.tweet_id} />
        </div>
    );
};

export default TweetCard;
