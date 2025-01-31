// src/pages/Chat.tsx
import { Sidebar } from "@/components/chat/Sidebar";
import Content from "@/components/chat/Content";
import useSidebarStore from "@/stores/ui/useSidebar";

export default function Chat() {
  const { is_sidebar_open } = useSidebarStore();

  return (
    <>
      {is_sidebar_open && <Sidebar />}
      <Content />
    </>
  );
}
