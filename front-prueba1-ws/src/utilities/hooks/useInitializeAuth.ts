import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { useJwt } from "react-jwt";

export function useInitializeAuth() {
  const setLoginState = useAppStore((state) => state.setLoginState);
  const logout = useAppStore((state) => state.logout);
  const setToken = useAppStore((state) => state.setToken);
  const [isInitialized, setIsInitialized] = useState(false)

  const storedToken = localStorage.getItem("token");
  const { decodedToken, isExpired, reEvaluateToken } = useJwt(storedToken || "");
  
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
      try {
        //TODO: logica peticion renovar token:
        // const newToken = await refreshToken(storedToken);
        reEvaluateToken("newToken");
        setToken("newToken")
      } catch (error) {
        localStorage.removeItem("token");
        logout();
      } finally {
        setIsInitialized(true);
      }
    }
  }, [decodedToken]); //recordar que usejwt es asíncrono

  return { isInitialized, decodedToken };
}