import { Sidebar } from "@/components/shared/Sidebar";
import { MobileNav } from "@/components/shared/MobileNav";
import { FeedHeader } from "@/components/home/FeedHeader";
import { FeedList } from "@/components/home/FeedList";
import { FeedDivider } from "@/components/home/FeedDivider";
import { Composer } from "@/components/home/Composer";

export default function Home() {
  return (
    <div className="flex flex-1 min-h-screen bg-canvas">
      <Sidebar pathname="/" />
      <MobileNav pathname="/" />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="max-w-[760px] w-full mx-auto px-5 md:px-10 pt-16 md:pt-[34px] pb-20">
          <FeedHeader />
          <Composer />
          <FeedDivider />
          <div className="flex flex-col gap-4">
            <FeedList />
          </div>
        </div>
      </main>
    </div>
  );
}
