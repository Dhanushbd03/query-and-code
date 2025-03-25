import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/stores/logic/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuthStore } from "@/stores/logic/adminAuthStore";
import Spinner from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading: userLoading } = useAuthStore();
  const { is_authenticated: isAdminAuthenticated } = useAdminAuthStore();
  const location = useLocation();
  const { toast } = useToast();

  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Handle admin routes first
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      toast({
        title: "Error",
        description: "You need to be logged in as admin to access this page",
        variant: "destructive",
      });
      return <Navigate to="/admin/signin" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  // For non-admin routes, show loading spinner if we're still loading user data
  if (userLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="80" color="white" />
      </div>
    );
  }

  // Handle regular routes
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
