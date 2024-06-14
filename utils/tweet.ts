import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
const table = 'tweets';

export const fetchTweetData = async () => {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('tweet_id, created_at, who_posted ( user ( name, img ) ), tweet_content, parent');

        if (error) throw error;

        const tweetsWithParentNames = await Promise.all(
            data.map(async (tweet) => {
                if (tweet.parent) {
                    // const parentUsername = await getParentUsername(tweet.parent);
                    return { ...tweet };
                }
                return tweet;
            })
        );

        return tweetsWithParentNames.reverse();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

// const getParentUsername = async (parentId) => {
//     try {
//         const { data, error } = await supabase
//             .from(table)
//             .select('tweet_id, who_posted ( user ( name ) )')
//             .eq('tweet_id', parentId)
//             .single();

//         if (error) throw error;
//         return data ? data.who_posted.user.name : null;
//     } catch (error) {
//         console.error('Error fetching parent tweet username:', error);
//         return null;
//     }
// };
