import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SocketProvider } from "./application/context/socketContext";
import { useInitializeAuth } from "./application/hooks/useInitializeAuth";
import AuthRoutes from "./routes/AuthRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import AppLayout from "./ui/layouts/AppLayout";
import CreateSudokuView from "./ui/views/CreateSudokuView";
import HomeView from "./ui/views/HomeView";
import LoginView from "./ui/views/loginView/LoginView";
import PVESudokuView from "./ui/views/pveSudokuView/PVESudokuView";
import RegisterView from "./ui/views/registerView/RegisterView";
import UserView from "./ui/views/UserView";
import PVEGameWinView from "./ui/views/pveGameWinView/PVEGameWinView";
import { useAppStore } from "./application/store/useAppStore";

export default function RouterApp() {

    const { isInitialized, decodedToken, isExpired } = useInitializeAuth();
    const token = useAppStore(state => state.token)


    const isAuth = Boolean(token);

    if (!isInitialized) {
        return <div>Cargando...</div>;
    }


    return (
        <BrowserRouter>
            <SocketProvider>
                <Routes>


                    <Route element={<AppLayout expiredTokenProps={{isExpired, decodedToken}}/>}>

                        <Route element={<PublicRoutes isAuth={isAuth} redirectTo="/" />}>
                            <Route path="/auth/login" element={<LoginView />} />
                            <Route path="/auth/register" element={<RegisterView />} />
                        </Route>

                        <Route element={<AuthRoutes isAuth={isAuth} redirectTo="/home" />}>
                            <Route element={<UserView />} path="/" />
                            <Route path="/pve/create" element={<CreateSudokuView />} />
                            <Route path="/pve/sudoku" element={<PVESudokuView />} />
                            <Route path="/pve/win" element={<PVEGameWinView />} />
                        </Route>

                        {/* ruta pública por defecto */}
                        <Route path="/home" element={<HomeView />} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </SocketProvider>
        </BrowserRouter>
    )
}