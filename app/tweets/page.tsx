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
    <div className="flex flex-col items-center bg-black text-white dark:[color-scheme:dark]">
      <div className="w-full">
        <nav className="w-full flex justify-center bg-black border-b border-b-foreground/10 h-16">
          <div className="flex justify-between items-center p-3 text-sm">
            <AuthButton />
          </div>
        </nav>
      </div>
      <div className="my-10 mx-4 sm:mx-8 md:mx-16 lg:mx-24"><TweetBox /></div>
      <div className="animate-in flex-1 flex flex-col px-3 sm:px-6 md:px-12 lg:px-16 dark:[color-scheme:dark]">
        <Tweets />
      </div>
    </div>


  );
}
