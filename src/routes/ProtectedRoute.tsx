import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "@/store/Api/UserApi/UserApi";
import { FaSpinner } from "react-icons/fa";

type role =
  | "VIEWER"
  | "EMPLOYEE"
  | "SUPPORTER"
  | "MANAGER"
  | "ADMIN"
  | "CLIENT"
  | "SUPERADMIN";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { data, isLoading } = useGetProfileQuery({});
  console.log("ProtectedRoute", data);
  const location = useLocation();
  if (isLoading)
    return (
      <>
        <FaSpinner className="animate-spin" size={24} />
      </>
    );
  const user = data?.data;
  console.log(user)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role as role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
