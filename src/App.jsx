import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/Login";
import AuthProvider from "./components/AuthProvider";
import Home from "./pages/Home";
import HitPayCheckout from "./pages/HitPayCheckout";
import Menu from "./pages/Menu";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/payment" element={<HitPayCheckout />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="*" element={<Navigate to='/login' />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

