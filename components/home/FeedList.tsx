"use client";

import { useFeed } from "@/components/shared/FeedProvider";
import { PostCard } from "@/components/home/PostCard";

export function FeedList() {
  const { posts } = useFeed();

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}