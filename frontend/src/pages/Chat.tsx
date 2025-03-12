// src/pages/Chat.tsx
import { Sidebar } from "@/components/chat/Sidebar";
import Content from "@/components/chat/Content";
import useSidebar from "@/stores/ui/useSidebar";

export default function Chat() {
  const { is_sidebar_open } = useSidebar();

  return (
    <div className="flex h-full relative min-w-[320px] w-full">
      <Sidebar
        className={`${is_sidebar_open ? "w-80" : "w-0"} transition-all `}
      />
      <Content />
    </div>
  );
}
