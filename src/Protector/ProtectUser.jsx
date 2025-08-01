import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
const ProtectUser = ({ children, allowedRoles }) => {
  // const user = useSelector((state) => state.auth.user?.user); // the logic for how to know
  const navigate = useNavigate();
  if (0) {
    // return <Navigate to="/unauthorized" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};
export default ProtectUser;
