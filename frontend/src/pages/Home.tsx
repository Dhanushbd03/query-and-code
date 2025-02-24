// src/pages/Home.tsx
import { Sidebar } from "@/components/home/Sidebar";
import { TemplateCard } from "@/components/home/TemplateCard";
import useSidebar from "@/stores/ui/useSidebar";
import { useEffect, useState } from "react";
import { getLanguages, Language } from "@/api/api_routes";
import { toast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";

export default function Home() {
  const { is_sidebar_open } = useSidebar();
  const [languages, set_languages] = useState<Language[]>([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      set_loading(true);
      const response = await getLanguages();
      if (response.success) {
        set_languages(response.data);
      } else {
        toast({
          title: "Failed to fetch languages",
          description: response.message,
          variant: "destructive",
        });
      }
      set_loading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {is_sidebar_open && <Sidebar />}
      {!loading ? (
        <div className="flex-1 p-6">
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
        <Spinner size={"80"} color={"white"} className="h-screen w-screen" />
      )}
    </>
  );
}
