import { FaReact } from "react-icons/fa6";
import { RiSvelteFill } from "react-icons/ri";
import { FaAngular } from "react-icons/fa";
import { LoaderPinwheel } from "lucide-react";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  react: FaReact,
  svelte: RiSvelteFill,
  angular: FaAngular,
  default: LoaderPinwheel,
};

export default iconMap;
