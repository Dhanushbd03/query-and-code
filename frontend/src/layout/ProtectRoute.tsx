import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/stores/logic/useAuthStore";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();
  const { toast } = useToast();

  if (loading) {
    return <div>Loading...</div>; // Show loading state instead of redirecting too early
  }

  if (!isAuthenticated) {
    toast({
      title: "Error",
      description: "You need to be logged in to access this page",
      variant: "destructive",
    });

    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
