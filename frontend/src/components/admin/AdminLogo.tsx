import logo from "@/assets/logo2.png";
import { useNavigate } from "react-router-dom";

const AdminLogo = () => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate("/admin")} className="cursor-pointer">
      <img
        src={logo}
        alt="Query and code Admin"
        className="h-20 filter"
      />
    </div>
  );
};

export default AdminLogo; 