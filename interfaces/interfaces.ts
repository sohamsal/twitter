export interface User {
    img: string;
    link: string;
    name: string;
}

export interface Tweet {
    tweet_id: number;
    created_at: string;
    who_posted: { user: User };
    tweet_content: string;
    parent: number;
    likes: number;
    replies: number;
}

export interface Engagement {
    tweet_id: number;
    likes: number;
    replies: number;
}