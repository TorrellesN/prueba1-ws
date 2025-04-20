import { useContext } from "react";
import { request } from "../../utilities/apiConfig/axios";
import { UserLogedData, UserLogedSchema, UserLoginData, UserRegisterData } from "../../utilities/types";
import { UserContext } from "../../utilities/context/ userContext";

/* export async function loginUser (email: string, pwd: string) {
    console.log('entrando en funcion service')
    try {
        
        const {data} = await api.post('/users/login', {email, pwd});
        const result = UserLogedSchema.safeParse(data)
        if (result.success) {
            return result.data;
        } else {
            console.log('2')
            console.log(data);
            
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        
        if (axiosError.code === 'ERR_NETWORK') {
          // Error de red (sin conexión, servidor caído, CORS, etc.)
          throw new Error('No se pudo conectar al servidor. Verifica tu conexión a internet.');
        } else if (axiosError.response) {
          // Error de la API (4xx, 5xx)
          throw new Error(axiosError.response.data?.message || 'Error en la autenticación');
        } else {
          // Otros errores
          throw new Error('Error desconocido al intentar iniciar sesión');
        }
      }
} */
type errorApi = {
  status: number,
  message: string
}
export async function loginService(user: UserLoginData): Promise<UserLogedData> {
  try {

    if (user.rememberme) {
      localStorage.setItem('userLogin', JSON.stringify({
        email: user.email,
        pwd: user.pwd
      }))
    } else {
      localStorage.removeItem('userLogin')
    }

    const data = await request("post", '/users/login', { email: user.email, pwd: user.pwd });
    console.log('desde peticion service', data);
    const result = UserLogedSchema.safeParse(data)

    if (result.success) {
      return result.data as UserLogedData;
    } else {
      throw { status: 404 }
    }

  } catch (error: any) {

    if (error.status === 401) {
      console.log('desde servic: ', error.message)
      error.message = "El usuario o la contraseña son incorrectos.";
      throw error;
    } else if (error.status === 404) {
      console.log('desde service: ', error.message)

      throw error;
    } else {
      console.log('desde: ', error.message)
      throw error;

    }
  }
};

export function registerService(user: UserRegisterData): Promise<UserLoginData> {
  return request("post", '/users/register', user);
};   