import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/layouts/AppLayout";
import { SocketProvider } from "./utilities/context/socketContext";
import { UserProvider } from "./utilities/context/userContext";
import { useInitializeAuth } from "./utilities/hooks/useInitializeAuth";
import CreateSudokuView from "./ui/views/CreateSudokuView";
import HomeView from "./ui/views/HomeView";
import LoginView from "./ui/views/loginView/LoginView";
import OnePSudokuView from "./ui/views/PVESudokuView";
import RegisterView from "./ui/views/registerView/RegisterView";
import { useAppStore } from "./utilities/store/useAppStore";
import AuthRoutes from "./routes/AuthRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import UserView from "./ui/views/UserView";

export default function RouterApp() {

    const { isInitialized } = useInitializeAuth();



    const token = useAppStore(state => state.token)
    const isAuth = Boolean(token);

    if (!isInitialized) {
        return <div>Cargando...</div>;
    }

    return (
        <BrowserRouter>
            <SocketProvider>
                <Routes>


                    {/* Layout principal (accesible siempre) */}
                    <Route element={<AppLayout />}>

                        {/* Rutas públicas (solo accesibles sin autenticación) */}
                        <Route element={<PublicRoutes isAuth={isAuth} redirectTo="/" />}>
                            <Route path="/auth/login" element={<LoginView />} />
                            <Route path="/auth/register" element={<RegisterView />} />
                        </Route>

                        {/* Rutas autenticadas (solo accesibles con login) */}
                        <Route element={<AuthRoutes isAuth={isAuth} redirectTo="/home" />}>
                            <Route element={<UserView />} path="/" />
                            <Route path="/pve/create" element={<CreateSudokuView />} />
                            <Route path="/pve/sudoku" element={<OnePSudokuView />} />
                        </Route>

                        {/* ruta pública por defecto */}
                        <Route path="/home" element={<HomeView />} />

                        {/* Redirección para rutas no encontradas */}
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Route>
                </Routes>
            </SocketProvider>
        </BrowserRouter>
    )
}