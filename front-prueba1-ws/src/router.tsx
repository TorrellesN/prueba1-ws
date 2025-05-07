import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SocketProvider } from "./application/context/socketContext";
import { useInitializeAuth } from "./application/hooks/useInitializeAuth";
import AuthRoutes from "./routes/AuthRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import AppLayout from "./ui/layouts/AppLayout";
import PveCreateSudokuView from "./ui/views/pveCreateSudokuView/PveCreateSudokuView";
import HomeView from "./ui/views/HomeView";
import LoginView from "./ui/views/loginView/LoginView";
import PveSudokuView from "./ui/views/pveSudokuView/PveSudokuView";
import RegisterView from "./ui/views/registerView/RegisterView";
import UserView from "./ui/views/UserView";
import PveGameWinView from "./ui/views/pveGameWinView/PveGameWinView";
import { useAppStore } from "./application/store/useAppStore";
import PvpCreateSudokuView from "./ui/views/pvpCreateSudokuView/PvpCreateSudokuView";
import PvpWaitingView from "./ui/views/pvpWaitingView/PvpWaitingView";
import { initTheme } from "./ui/components/themeUtils";
import PvpSudokuView from "./ui/views/pvpSudokuView/PvpSudokuView";

export default function RouterApp() {

    const { isInitialized, decodedToken, isExpired } = useInitializeAuth();
    const token = useAppStore(state => state.token)
    initTheme();

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

                        <Route element={<AuthRoutes isAuth={isAuth} redirectTo="/auth/login" />}>
                            <Route element={<UserView />} path="/" index/>
                            <Route path="/pve/create" element={<PveCreateSudokuView />} />
                            <Route path="/pve/sudoku" element={<PveSudokuView />} />
                            <Route path="/pve/win" element={<PveGameWinView />} />
                            <Route path="/pvp/create" element={<PvpCreateSudokuView />} />
                            <Route path="/pvp/waiting" element={<PvpWaitingView />} />
                            <Route path="/pvp/sudoku" element={<PvpSudokuView />} />
                            
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