import type { Post, PostKind } from "@/app/_data/feed";
import {
  CommentIcon,
  HeartIcon,
  ImageIcon,
  MegaphoneIcon,
} from "@/app/_components/icons";

interface PostKindStyle {
  badgeLabel: string;
  badgeBg: string;
  badgeDot: string;
  badgeText: string;
  avatar: string;
}

const kindStyles: Record<PostKind, PostKindStyle> = {
  achievement: {
    badgeLabel: "LOGRO",
    badgeBg: "bg-[#CFEBD8]",
    badgeDot: "bg-[#3E9B6C]",
    badgeText: "text-[#3E9B6C]",
    avatar: "bg-[#A9D9E8] text-[#1F7A93]",
  },
  activity: {
    badgeLabel: "ACTIVIDAD",
    badgeBg: "bg-[#C7E7F1]",
    badgeDot: "bg-[#2E89A6]",
    badgeText: "text-[#2E89A6]",
    avatar: "bg-[#A9D9E8] text-[#1F7A93]",
  },
  announcement: {
    badgeLabel: "ANUNCIO",
    badgeBg: "bg-[#CCD8F4]",
    badgeDot: "bg-[#4E72C8]",
    badgeText: "text-[#4E72C8]",
    avatar: "bg-[#CCD8F4] text-[#4E72C8]",
  },
};

export function PostCard({ post }: { post: Post }) {
  const style = kindStyles[post.kind];

  return (
    <article className="rounded-[20px] border border-line bg-surface px-[22px] py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,0.5)]">
      <header className="mb-3.5 flex items-center gap-3">
        <Avatar kind={post.kind} authorName={post.authorName} style={style.avatar} />
        <div className="min-w-0 flex-1">
          <div className="font-display text-[16.5px] font-semibold text-ink">
            {post.authorName}
          </div>
          <div className="text-[12.5px] text-ink-faint">
            {post.time} · publicado por vos
          </div>
        </div>
        <div
          className={`flex items-center gap-[7px] rounded-full px-3 py-1.5 ${style.badgeBg}`}
        >
          <span className={`size-2 rounded-full ${style.badgeDot}`} />
          <span className={`text-xs font-extrabold tracking-[0.5px] ${style.badgeText}`}>
            {style.badgeLabel}
          </span>
        </div>
      </header>

      <p className="mb-2.5 text-[12.5px] text-ink-faint">{post.audienceLabel}</p>
      <p className="text-[15.5px] leading-[1.55] text-[#4A4038]">{post.body}</p>

      {post.attachment && <PhotoAttachment label={post.attachment.label} />}

      <footer className="mt-4 flex items-center gap-[18px] border-t border-[#F0E6D8] pt-3.5">
        <span className="flex items-center gap-[7px] text-sm font-bold text-brand">
          <HeartIcon />
          {post.likes}
        </span>
        <a href="#" className="flex items-center gap-[7px] text-sm font-bold text-[#94887B]">
          <CommentIcon />
          {post.comments}
        </a>
        <span className="flex-1" />
        <a href="#" className="text-sm font-extrabold text-[#C5503A]">
          Editar
        </a>
      </footer>
    </article>
  );
}

function Avatar({
  kind,
  authorName,
  style,
}: {
  kind: PostKind;
  authorName: string;
  style: string;
}) {
  const base =
    "flex size-11 flex-none items-center justify-center rounded-full font-display text-[17px] font-semibold";

  if (kind === "announcement") {
    return (
      <span className={`${base} ${style}`}>
        <MegaphoneIcon />
      </span>
    );
  }

  return <span className={`${base} ${style}`}>{authorName.charAt(0)}</span>;
}

function PhotoAttachment({ label }: { label: string }) {
  return (
    <a
      href="#"
      className="mt-3.5 flex h-[200px] flex-col items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]"
    >
      <ImageIcon />
      <span className="text-[13.5px]">{label}</span>
    </a>
  );
}