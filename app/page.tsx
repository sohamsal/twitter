import { redirect } from "next/navigation";


export default async function Index() {
  redirect("/login");
  // return (
  //   <div className="flex-1 w-full flex flex-col gap-20 items-center dark:[color-scheme:dark]">
  //     {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
  //       <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
  //         {<AuthButton />}
  //       </div>
  //     </nav>

  //     <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
  //       <main className="flex-1 flex flex-col gap-6">
  //         <h2 className="font-bold text-4xl mb-4">Next steps</h2>
  //       </main>
  //     </div> */}
      
  //   </div>
  // );
}
