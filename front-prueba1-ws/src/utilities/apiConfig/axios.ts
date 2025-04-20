import axios from 'axios';

const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL_DEVELOPMENT,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})


//interceptores para agregar token
axiosApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});


//funcion generica
type Method = "get" | "post" | "put" | "delete" | "patch";


export async function request<T>(method: Method, url: string, data?: any, options?: any): Promise<T> {
    try {
        const res = await axiosApi.request<T>({ method, url, data, ...options, });
        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const code = error.code;
      
          if (code === 'ERR_NETWORK') {
            throw { status: 503, message: "Error de conexión. Vuelve a intentarlo más tarde." };
          }
      
          const msg = getErrorMessageByStatus(status);
          if (!msg) throw { status, message: 'Ha ocurrido un error inesperado. Vuelve a intentarlo más tarde.' };
          throw { status, message: msg };
        } else {
          throw { status: 503, message: "Error de servidor." };
        }
      }
}

const getErrorMessageByStatus = (status?: number): string => {
     const messages: Record<number, string> = {
        0: "",
         401: "Usuario no autorizado, vuelve a iniciar sesión.", 
         403: "No tienes permiso para hacer esto.", 
         404: "Error en la gestión de información, vuelve a intentarlo más tarde.",
         500: "No se ha podido conectar con el servidor, vuelve a intentarlo más tarde.", 
         503: "No hay conexión. Vuelve a intentarlo más tarde.", };

return messages[status || 0] || "";
};


//capa servicio ej
/* export const getUser = (id: string, token?: string) =>
    request<User>("get", `/users/${id}`); */
/* export const updateUser = (id: string, body: Partial<User>) =>
    request<User>("put", `/users/${id}`, body); */

//en componente
/* const handleFetchUser = async () => {
    try {
      const user = await getUserById("123");
      // hacer algo con user
    } catch (err: any) {
      const msg = getErrorMessageByStatus(err.status);
      toast.error(msg);
    }
  }; */


