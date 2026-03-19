import { Navigate } from "react-router-dom";
import { useAuthState } from "../hooks/useAuthState";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0914] flex items-center justify-center">
        <Loader2 className="text-cyan-400 animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
