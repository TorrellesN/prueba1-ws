import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import HomeView from "./views/HomeView";
import { SocketProvider } from "./utilities/context/socketContext";
import { UserProvider } from "./utilities/context/ userContext";
import CreateSudokuView from "./views/CreateSudokuView";
import OnePSudokuView from "./views/OnePSudokuView";

export default function RouterApp() {
    return (
        <BrowserRouter>
            <SocketProvider>
                <UserProvider>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<HomeView />} index />
                        <Route path="/oneplayer/create" element={<CreateSudokuView />} />
                        <Route path="/oneplayer/sudoku" element={<OnePSudokuView />} />
                    </Route>
                </Routes>
                </UserProvider>
            </SocketProvider>
        </BrowserRouter>
    )
}