import { currentUser, posts, room } from "@/app/_data/feed";
import { CameraIcon } from "@/app/_components/icons";
import { FeedShell } from "@/app/_components/FeedShell";
import { PostCard } from "@/app/_components/PostCard";

export default function Home() {
  return (
    <FeedShell>
      <div className="mx-auto w-full max-w-[760px] px-4 pt-6 pb-20 sm:px-10 sm:pt-[34px]">
        <header className="mb-6">
          <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-brand-dark">
            GUARDERÍA · {room.name.toUpperCase()}
          </div>
          <h1 className="font-display text-[30px] font-semibold text-ink">
            Buenas, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="mt-[5px] text-[14.5px] text-[#94887B]">{room.meta}</p>
        </header>

        <a
          href="#"
          className="mb-6 flex items-center gap-3.5 rounded-[18px] border border-line bg-surface px-[18px] py-3.5 shadow-[0_4px_14px_-10px_rgba(120,90,60,0.4)]"
        >
          <span className="flex size-10 flex-none items-center justify-center rounded-full bg-[#F2937A] font-display text-base font-semibold text-white">
            {currentUser.initial}
          </span>
          <span className="flex-1 text-[15px] text-ink-faint">Compartí un momento…</span>
          <span className="flex size-[38px] flex-none items-center justify-center rounded-xl bg-nav-active text-brand">
            <CameraIcon />
          </span>
        </a>

        <div className="mb-3.5 flex items-center gap-3.5">
          <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
            PUBLICADO HOY
          </span>
          <span className="h-px flex-1 bg-[#E7DAC8]" />
        </div>

        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </FeedShell>
  );
}