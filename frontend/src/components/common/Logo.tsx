import logo from "@/assets/logo2.png";
import { useNavigate } from "react-router-dom";
const Logo = () => {
  const navigate = useNavigate();
  return (
    <div onClick={() => 
      navigate("/")
    } className="cursor-pointer" 
      >
      <img
        src={logo}
        alt="Query and code"
        className="h-28  filter"
      />
    </div>
  );
};
export default Logo;
