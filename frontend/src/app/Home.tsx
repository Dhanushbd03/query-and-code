
import { FaReact } from "react-icons/fa6";
import { RiSvelteFill } from "react-icons/ri";
import { FaAngular } from "react-icons/fa";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TemplateCard } from "@/components/TemplateCard";

const templates = [
  {
    icon: FaReact,
    title: "React",
    description:
      "Create a blank chatbot, which you can train and customize later.",
  },
  {
    icon: RiSvelteFill,
    title: "Svelte",
    description:
      "Crawl your website's content to get answers to popular user questions.",
  },
  {
    icon: FaAngular,
    title: "Angular",
    description:
      "Crawl your website's content to get answers to popular user questions.",
  }  
];

export default function Home() {
  return (
    <div className="min-h-screen bg-mainbg text-white flex">
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex flex-1 gap-5">
          <Sidebar />
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-2">
                Choose the wanted framework or language{" "}
              </h1>
              <p className="text-slate-400">
                Streamline your development process with AI-powered, accurate
                answers from official documentation.
              </p>Svelte
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template, index) => (
                <TemplateCard key={index} {...template} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
