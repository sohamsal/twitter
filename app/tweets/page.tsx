import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Tweets from "@/components/Tweets";
import TweetBox from "@/components/TweetBox";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-black text-white dark:[color-scheme:dark]">
      <div className="w-full">
        {/* <div className="py-2 font-bold bg-purple-950 text-center">
          This is a protected page that you can only see as an authenticated
          user
        </div> */}
        <nav className="w-full flex justify-center bg-black border-b border-b-foreground/10 h-16">
          <div className="flex justify-between items-center p-3 text-sm">
            <AuthButton />
          </div>
        </nav>
      </div>
      <div className="my-10"><TweetBox /></div>
      <div className="animate-in flex-1 flex flex-col gap-20 max-w-4xl px-3 dark:[color-scheme:dark]">
        <Tweets/>
      </div>
    </div>
  );
}
