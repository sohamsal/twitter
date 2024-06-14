"use client"
import { createClient } from "@/utils/supabase/client";

export default function Login({ }) {
  const googleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <button
        onClick={googleLogin}
        className="bg-purple-500 text-white hover:bg-purple-800 rounded-md px-4 py-2 text-foreground mb-2"
      >
        Sign up/in with Google
      </button>
    </div>
  );
}
