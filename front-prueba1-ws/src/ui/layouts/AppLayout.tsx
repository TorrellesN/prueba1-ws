import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NavMenu from "../components/sharedComponents/NavMenu";
import Logo from "../components/sharedComponents/Logo";
import { useEffect } from "react";

type AppLayoutProps = {
  expiredTokenProps: {
    isExpired: boolean;
    decodedToken: unknown;
  };
};

export default function AppLayout({expiredTokenProps}: AppLayoutProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (expiredTokenProps.isExpired && expiredTokenProps.decodedToken) {
      toast.warning('Tu sesión ha caducado, debes volver a logearte.')
      navigate('/auth/login')
    }
  }, [expiredTokenProps.isExpired])


  return (
    <div className="min-h-screen">
      <header className="bg-gray-800 py-5">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
          <div className="w-64">
            <Link to={'/'} >
              <Logo />
            </Link>
          </div>
          <NavMenu />
        </div>
      </header>

      <section className="max-w-screen-2xl mt-10 p-5 mx-auto flex flex-col" > {/* mx-auto */}
        <Outlet />
      </section>
      <footer className="py-5">
        <p className="text-center">
          Todos los derechos reservados {new Date().getFullYear()}
        </p>
      </footer>
      <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </div>
  );
}
