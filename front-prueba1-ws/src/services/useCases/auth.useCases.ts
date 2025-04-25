import { loginService, registerService } from "../apiRepo/authService";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAppStore } from "../../utilities/store/useAppStore";
import { UserLoginData, UserRegisterData } from "../../utilities/types";


//HOOKS PERSONALIZADOS manejan zustand y api calls

export const useLogin = () => {
    const [authError, setAuthError] = useState('')
    const [isAuthLoading, setIsAuthLoading] = useState(false)
    const setLoginState = useAppStore((state) => state.setLoginState);

  const handleLogin = async (formData: UserLoginData) => {
    setIsAuthLoading(true);
    setAuthError('');
    
    if (formData.rememberme) {
          localStorage.setItem('userLogin', JSON.stringify({
            email: formData.email,
            pwd: formData.pwd
          }))
        } else {
          localStorage.removeItem('userLogin')
        }
    try {
      const userLogedData = await loginService(formData);
      await setLoginState(userLogedData);
      /* toast.success("Has iniciado sesión"); */
    } catch (error: any) {
        const err = error as Error;
      setAuthError(err.message || "Error desconocido");
      /* toast.error(err.message || "Error desconocido"); */
    } finally {
      setIsAuthLoading(false);
    }
  };

  return { handleLogin, isAuthLoading, authError };
};


export const useRegister = () => {
    const [authError, setAuthError] = useState('')
    const [isAuthLoading, setIsAuthLoading] = useState(false)
    const setLoginState = useAppStore((state) => state.setLoginState);

  const handleRegister = async (formData: UserRegisterData) => {
    setIsAuthLoading(true);
    setAuthError('');
    
    try {
      const userRegisteredData = await registerService(formData);
      const userLogedData = await loginService(userRegisteredData);
      await setLoginState(userLogedData);
      /* toast.success("Has iniciado sesión"); */
    } catch (error: any) {
        const err = error as Error;
      setAuthError(err.message || "Error desconocido");
      /* toast.error(err.message || "Error desconocido"); */
    } finally {
      setIsAuthLoading(false);
    }
  };

  return { handleRegister, isAuthLoading, authError };
};