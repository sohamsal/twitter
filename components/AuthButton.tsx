import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server"
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/tweets");
  };


  return user ? (
    <div className="flex items-center">
      <img src={user.user_metadata.picture} className="rounded-full h-8 w-8 mx-2"></img>
      Hey, {user.user_metadata.name}!
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover ml-6">
          Logout
        </button>
      </form>

    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-purple-600 bg-btn-background hover:bg-btn-background-hover hover:bg-purple-800"    >
      Login/Sign Up to Tweet
    </Link>
  );
}
