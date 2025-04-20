import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import HomeView from "./views/HomeView";
import { SocketProvider } from "./utilities/context/socketContext";
import { UserProvider } from "./utilities/context/userContext";
import CreateSudokuView from "./views/CreateSudokuView";
import OnePSudokuView from "./views/OnePSudokuView";
import RegisterView from "./views/registerView/RegisterView";
import LoginView from "./views/loginView/LoginView";
import { useInitializeAuth } from "./utilities/hooks/useInitializeAuth";
import { useAppStore } from "./utilities/store/useAppStore";

export default function RouterApp() {

    useInitializeAuth();

    const { isInitialized } = useAppStore();
    if (!isInitialized) {
        return <div>Cargando...</div>;
    }

    return (
        <BrowserRouter>
            <SocketProvider>
                <UserProvider>
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route path="/" element={<HomeView />} index />
                            <Route path="/auth/register" element={<RegisterView />} />
                            <Route path="/auth/login" element={<LoginView />} />
                            <Route path="/oneplayer/create" element={<CreateSudokuView />} />
                            <Route path="/oneplayer/sudoku" element={<OnePSudokuView />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Routes>
                </UserProvider>
            </SocketProvider>
        </BrowserRouter>
    )
}