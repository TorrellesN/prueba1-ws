import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { loginService } from "../../../infrastructure/services/authService";
import { useApiRequest } from "../../../application/hooks/useApiRequest";
import { User, UserLoginData, UserLoginDataWRememberSchema } from "../../../domain/";
import { useLogin } from "../../../application/useCases/auth.useCases";
import { useAppStore } from "../../../application/store/useAppStore";

// Definición de tipos
/* type FormData = {
  email: string;
  password: string;
  rememberme: boolean;
}; */

/* type FormErrors = {
  email?: string;
  password?: string;
}; */

export function LoginForm() {

  /* const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberme: false
  }); */

  /* const [errors, setErrors] = useState<FormErrors>({}); */
  /* const [isSubmitting, setIsSubmitting] = useState<boolean>(false); */


  /* useEffect(()=> {
    const remembermeData = localStorage.getItem('userLogin');
    if (remembermeData) {
      const remembermeOb = JSON.parse(remembermeData)
      setFormData({
        ...formData,
        email: remembermeOb.email,
        password: remembermeOb.password,
        rememberme: true
      })
    }
  }, []) */


  // Validación con tipos
  /*  const validateForm = (): boolean => {
     const newErrors: FormErrors = {};
 
     if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
     if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
 
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   }; */

  // Manejo de eventos con tipos
  /* const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validateForm()) return;

    if (formData.rememberme) {
      localStorage.setItem('userLogin', JSON.stringify({
        email: formData.email,
        password: formData.password
      }))
    } else {
      localStorage.removeItem('userLogin')
    } */


  /* setIsSubmitting(true); */


  /* }; */

  /* const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleRemember = () => {
    setFormData((prevForm) => ({
      ...prevForm,
      rememberme: !prevForm.rememberme
    }));
  } */

  /* const { dataApi, loading, errorApi, execute } = useApiRequest<User>() */
  const { handleLogin, isAuthLoading, authError } = useLogin();
  const  token = useAppStore((state) =>  state.token );

  const [defaultData] = useState<UserLoginData>(() => {
    const remembermeData = localStorage.getItem('userLogin');
    if (remembermeData) {
      const remembermeOb = JSON.parse(remembermeData);
      return {
        email: remembermeOb.email,
        pwd: remembermeOb.pwd,
        rememberme: true
      };
    }
    return {
      email: '',
      pwd: '',
      rememberme: false
    };
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<UserLoginData>({
    resolver: zodResolver(UserLoginDataWRememberSchema),
    defaultValues: defaultData
  })

  const onSubmit = async (formData: UserLoginData) => {
    console.log("Datos válidos:", formData);
    await handleLogin(formData)

    if (authError) {
      console.error("Error during login:", authError);
      return;
    }

    /* if (dataApi) {
      console.log("Login successful:", dataApi);
      Perform any additional actions with the logged-in user data
    } */

    reset();
  };

  useEffect(() => {
    if (!isAuthLoading && token) {
      toast.success('Has iniciado sesión')
    }
    if (!isAuthLoading && authError) (
      toast.error(authError)
    )
  }, [isAuthLoading, authError])



  return (
    <section className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Iniciar sesión
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>


        {/* email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500`}
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => <p className="text-red-500 text-sm">{message}</p>}
          />
        </div>



        {/* Contraseña */}
        <div>
          <label htmlFor="pwd" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            {...register("pwd")}
            type="password"
            id="pwd"
            className={`w-full p-2 border ${errors.pwd ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
          />
          <ErrorMessage
            errors={errors}
            name="pwd"
            render={({ message }) => <p className="text-red-500 text-sm">{message}</p>}
          />
        </div>

        {/* Remember */}
        <div className='flex flex-row items-center'>
          <input type="checkbox" id="rememberme" className='mb-1 mr-2'
            {...register("rememberme")}
          />
          <label htmlFor="rememberme" className="block text-sm font-medium text-gray-700 mb-1">
            Recuérdame
          </label>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          /* disabled={isSubmitting} */
          className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors ${isAuthLoading ? 'opacity-70 cursor-not-allowed' : ''}`} //${isAuthLoading ? 'opacity-70 cursor-not-allowed' : ''}
        >
          {isAuthLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrando...
            </span>
          ) : 'Registrarse'}
          cvb
        </button>
      </form>
    </section>
  );
}


