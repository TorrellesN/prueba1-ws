import { useEffect, useState } from "react";
import { useJwt } from "react-jwt";
import { useAppStore } from "../store/useAppStore";

export function useInitializeAuth() {
  const setLoginState = useAppStore((state) => state.setLoginState);
  const logout = useAppStore((state) => state.logout);
  const [isInitialized, setIsInitialized] = useState(false);

  const storedToken = localStorage.getItem("token");
  const { decodedToken, isExpired } = useJwt(storedToken || "");
  
  useEffect(() => {
    if (!storedToken) {
      setIsInitialized(true);
      return;
    }
    if (!decodedToken) return;

    if (!isExpired && decodedToken) {

      const decodedUser = decodedToken as any; 
      setLoginState({
        token: storedToken,
        user: {
          username: decodedUser.username,
          email: decodedUser.email,
          profileImg: decodedUser.profileImg,
        },
      });
      setIsInitialized(true);
      
    } else {
        logout();
        setIsInitialized(true);
    }
  }, [decodedToken]); //recordar que usejwt es asíncrono

  return { isInitialized, decodedToken, isExpired };
}