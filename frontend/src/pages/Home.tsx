// src/pages/Home.tsx
import { Sidebar } from "@/components/home/Sidebar";
import { TemplateCard } from "@/components/home/TemplateCard";
import { FaReact } from "react-icons/fa6";
import { RiSvelteFill } from "react-icons/ri";
import { FaAngular } from "react-icons/fa";

const templates = [
  { icon: FaReact, title: "React", description: "Create a blank chatbot." },
  { icon: RiSvelteFill, title: "Svelte", description: "Crawl your website's content." },
  { icon: FaAngular, title: "Angular", description: "Crawl your website's content." },
];

export default function Home() {
  return (
    <>
    {is_sidebar_open && <Sidebar />}
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-2">Choose a framework</h1>
        <p className="text-ctp-subtext1">
          Streamline your development process with AI-powered answers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {templates.map((template, index) => (
            <TemplateCard key={index} {...template} />
          ))}
        </div>
      </div>
    </>
  );
}
