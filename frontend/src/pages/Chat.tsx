import Content from "@/components/chat/Content";
import { Sidebar } from "@/components/chat/Sidebar";
import { Header } from "@/components/common/Header";

export default function Home() {
  return (
    <div className="flex h-screen bg-gradient-to-r from-ctp-crust via-ctp-base to-ctp-crust/95 flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {" "}
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}
