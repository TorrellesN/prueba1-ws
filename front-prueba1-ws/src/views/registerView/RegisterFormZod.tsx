import { useState, FormEvent, ChangeEvent, useEffect, useMemo } from 'react';
import { UserRegisterData, UserRegisterDataSchema } from '../../utilities/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { registerService } from '../../services/api/authService';
import { ErrorMessage } from '@hookform/error-message';
import { useApiRequest } from '../../utilities/hooks/useApiRequest';

// Definición de tipos
/* type FormData = {
  name: string;
  email: string;
  password: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
}; */

export function RegisterFormZod() {
  // Estado con tipos explícitos
  /* const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Validación con tipos
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
    if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de eventos con tipos
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulación de envío a API
      setTimeout(() => {
        console.log('Datos enviados:', formData);
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al editar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }; */
  
    const { dataApi, loading, errorApi, execute } = useApiRequest();

    //const isSubmitDisabled = !isDirty || !isValid || Object.keys(errors).length > 0;

    
  const {
      register,
      handleSubmit,
      setValue,
      formState: { errors, isValid, isDirty },
      reset
    } = useForm<UserRegisterData>({
      resolver: zodResolver(UserRegisterDataSchema),
      defaultValues: {
        username: '',
        email: '',
        pwd: '',
        pwdRep: ''
      }
    })

    /* const isSubmitDisabled = useMemo(() => !isValid || Object.keys(errors).length > 0, [isDirty, isValid]) */
      const onSubmit = async (formData: UserRegisterData) => {
        console.log("Datos válidos:", formData);
        /* await loginService(data); */
        await execute(() => registerService(formData));
    
        if (errorApi) {
          console.error("Error during login:", errorApi);
          return;
        }
    
        if (dataApi) {
          console.log("Login successful:", dataApi);
          // Perform any additional actions with the logged-in user data
        }
    
        console.log('cual se ejecuta antes')
        console.log(errorApi, 'error api')
    
        reset();
      };

    useEffect(() => {
        if (dataApi) {
          toast.success('usuario registrado con éxito')
        }
        if (errorApi) (
          toast.error(errorApi)
        )
      }, [dataApi, errorApi])


  return (
    <section className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Crear cuenta
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* grupo título y nombre */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
          />
          <ErrorMessage
            errors={errors}
            name="username"
            render={({ message }) => <p className="text-red-500 text-sm">{message}</p>}
          />
        </div>

        {/* email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
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

        <div>
          <label htmlFor="pwdRep" className="block text-sm font-medium text-gray-700 mb-1">
            Repetir contraseña
          </label>
          <input
            {...register("pwdRep")}
            type="password"
            id="pwdRep"
            className={`w-full p-2 border ${errors.pwdRep ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
          />
          <ErrorMessage
            errors={errors}
            name="pwdRep"
            render={({ message }) => <p className="text-red-500 text-sm">{message}</p>}
          />
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          /* disabled={isSubmitDisabled} */
          className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrando...
            </span>
          ) : 'Registrarse'}
        </button>
      </form>
    </section>
  );
}