// src/pages/Home.tsx
import { Sidebar } from "@/components/home/Sidebar";
import { TemplateCard } from "@/components/home/TemplateCard";
import useSidebar from "@/stores/ui/useSidebar";
import { useEffect } from "react";
import Spinner from "@/components/ui/spinner";
import useLanguage from "@/stores/logic/useLanguage";

export default function Home() {
  const { is_sidebar_open } = useSidebar();
  const { languages, l_loading, getLanguages } = useLanguage();
  useEffect(() => {
    getLanguages();
  }, []);

  if (l_loading) {
    return <Spinner size={"80"} color={"white"} className="size-full" />;
  }
  return (
    <div className="flex size-full relative">
      <Sidebar
        className={`h-full ${is_sidebar_open ? "w-28" : "w-0"} transition-all `}
      />
      {languages?.length > 0 ? (
        <div className="flex-1 p-6 h-full">
          <h1 className="text-2xl font-semibold mb-2">Choose a framework</h1>
          <p className="text-ctp-subtext1">
            Streamline your development process with AI-powered answers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {languages?.map((lang, index) => (
              <TemplateCard key={index} lang={lang} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 h-full flex items-center justify-center">
          <p className="text-ctp-subtext1">
            No languages available. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
