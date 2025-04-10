import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import HomeView from "./views/HomeView";

export default function RouterApp () {
    return (
        <BrowserRouter>
        <Routes>
            <Route element={<AppLayout/>}>
                <Route path="/" element={<HomeView />} index/>
            </Route>
        </Routes>
        </BrowserRouter>
    )
}