import { useState, FormEvent, ChangeEvent, useEffect } from 'react';

// Definición de tipos
type FormData = {
  email: string;
  password: string;
  rememberme: boolean;
};

type FormErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  // Estado con tipos explícitos
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberme: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


  useEffect(()=> {
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
  }, [])


  // Validación con tipos
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
    if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de eventos con tipos
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validateForm()) return;

    if (formData.rememberme) {
      localStorage.setItem('userLogin', JSON.stringify({
        email: formData.email,
        password: formData.password
      }))
    } else {
      localStorage.removeItem('userLogin')
    }


    setIsSubmitting(true);
    // Simulación de envío a API
    setTimeout(() => {
      console.log('Datos enviados:', formData);
      setIsSubmitting(false);
    }, 1500);

  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al editar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleRemember = () => {
    setFormData((prevForm) => ({
      ...prevForm,
      rememberme: !prevForm.rememberme
    }));
  }

  return (
    <section className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Iniciar sesión
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">


        {/* email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>



        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.password ? (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres</p>
          )}
        </div>

        {/* Remember */}
        <div className='flex flex-row items-center'

        >
          <input type="checkbox" name="rememberme" id="rememberme" className='mb-1 mr-2'
            onClick={toggleRemember}
            checked={formData.rememberme}
          />
          <label htmlFor="rememberme" className="block text-sm font-medium text-gray-700 mb-1">
            Recuérdame
          </label>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
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