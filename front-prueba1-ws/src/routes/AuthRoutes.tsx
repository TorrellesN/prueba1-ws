import { Navigate, Outlet, Route } from "react-router-dom";
import LoginView from "../ui/views/loginView/LoginView";
import RegisterView from "../ui/views/registerView/RegisterView";

interface AuthRoutesProps {
    isAuth: boolean;
    redirectTo?: string;
  }
  
  export default function AuthRoutes({ isAuth, redirectTo = "/home" }: AuthRoutesProps) {
    if (!isAuth) {
      return <Navigate to={redirectTo} replace />;
    }
  
    return <Outlet />;
  }