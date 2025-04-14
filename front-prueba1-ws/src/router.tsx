import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import HomeView from "./views/HomeView";
import { SocketProvider } from "./utilities/context/socketContext";

export default function RouterApp() {
    return (
        <BrowserRouter>
            <SocketProvider>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<HomeView />} index />
                    </Route>
                </Routes>
            </SocketProvider>
        </BrowserRouter>
    )
}