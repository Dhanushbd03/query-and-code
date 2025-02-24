import { Language } from "@/api/api_routes";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import iconMap from "@/components/icons/Icons";

interface Props {
  lang: Language;
}

export function TemplateCard({ lang }: Props) {
  const Icon = iconMap[lang.name.toLowerCase()] || iconMap["default"];
  return (
    <Link
      to={`${lang.id}`}
      className="group hover:scale-95 transition duration-300 h-full"
    >
      <div className="bg-ctp-base border border-ctp-flamingo rounded-lg p-6 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-slate-800 rounded-lg border">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            DEMO
          </Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{lang.name.toUpperCase()}</h3>
          <p className="text-sm text-slate-400">{lang.description}</p>
        </div>
      </div>
    </Link>
  );
}
