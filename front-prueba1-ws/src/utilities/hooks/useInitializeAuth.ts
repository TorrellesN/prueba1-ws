import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

export const useInitializeAuth = () => {
    const initializeAuth = useAppStore(state => state.initializeAuth);
    
    useEffect(() => {
      initializeAuth();
      
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'authToken') {
          initializeAuth();
        }
      };
  
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }, [/* initializeAuth */]);
  };