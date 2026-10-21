"use client";

import { PlusIcon } from "@/components/shared/icons";
import { useComposer } from "@/components/publications/ComposerProvider";

export function NewPostButton({ onOpen }: { onOpen?: () => void }) {
  const { open } = useComposer();

  const handleClick = () => {
    open();
    onOpen?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center gap-2 w-full p-3 rounded-[14px] text-white font-extrabold text-[14.5px] mb-[18px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] shadow-[0_8px_18px_-8px_rgba(238,129,100,0.75)]"
    >
      <PlusIcon className="w-[17px] h-[17px]" />
      Nueva publicación
    </button>
  );
}
