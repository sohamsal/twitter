'use server'
 
import { redirect } from 'next/navigation'
 
export async function tweetId(tweet_id: number) {
  redirect(`/tweets/${tweet_id}`)
}

export async function homeRedirect() {
    redirect(`/tweets`)
}