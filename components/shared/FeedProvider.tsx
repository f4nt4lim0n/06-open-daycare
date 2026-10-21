"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { getComposerKids } from "@/app/_data/kids";
import {
  posts as initialPosts,
  ROOM_AUDIENCE_ID,
  type PostType,
  type FeedPost,
} from "@/app/_data/mock";

export interface NewPostInput {
  audienceId: string; // kid id or ROOM_AUDIENCE_ID
  type: PostType;
  text: string;
}

export interface FeedContextValue {
  posts: FeedPost[];
  publishPost: (input: NewPostInput) => void;
}

const FeedContext = createContext<FeedContextValue | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);

  const publishPost = (input: NewPostInput) => {
    const kid = getComposerKids().find((k) => k.id === input.audienceId);
    const isRoom = input.audienceId === ROOM_AUDIENCE_ID;

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;

    const post: FeedPost = {
      id: `post-${Date.now()}`,
      authorName: kid ? kid.firstName : "Anuncio general",
      authorInitial: kid?.initial,
      avatarBg: kid ? kid.avatarBg : "#CCD8F4",
      avatarColor: kid ? kid.avatarColor : "#4E72C8",
      avatarIcon: kid ? undefined : "megaphone",
      time,
      publishedByMe: true,
      type: input.type,
      audience: isRoom ? "toda la sala" : `familia de ${kid?.firstName ?? ""}`,
      text: input.text,
      hearts: 0,
      comments: 0,
    };

    setPosts((prev) => [post, ...prev]);
  };

  const value: FeedContextValue = { posts, publishPost };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed(): FeedContextValue {
  const result = useContext(FeedContext);
  if (!result) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return result;
}
