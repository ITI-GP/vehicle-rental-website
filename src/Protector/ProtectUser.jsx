import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectUser = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
 
    return <Navigate to="/login" replace />;
  }



  return children;
};

export default ProtectUser;
