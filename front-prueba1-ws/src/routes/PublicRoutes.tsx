import { Navigate, Outlet } from "react-router-dom";

interface PublicRoutesProps {
  isAuth: boolean;
  redirectTo?: string;
}

export default function PublicRoutes({ isAuth, redirectTo = "/" }: PublicRoutesProps) {
  if (isAuth) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}