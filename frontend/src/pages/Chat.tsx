import Content from "@/components/chat/Content";
import { Sidebar } from "@/components/chat/Sidebar";
import { Header } from "@/components/common/Header";

export default function Home() {
  return (
    <div className="flex h-screen bg-mainbg flex-col">
      <Header />
      <div className="flex flex-1">
        {" "}
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}
