import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import BottomNav from './components/BottomNav';
// import Home from './pages/Home';
// import Members from './pages/Members';
// import PlayerDetail from './pages/PlayerDetail';
// import WarLog from './pages/WarLog';
// import CapitalRaids from './pages/CapitalRaids';
// import Others from './pages/Others';

import BaseHome from "./pages/BaseHome";
import UploadBase from "./pages/UploadBase";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/base" replace />} />
        <Route path="/base" element={<BaseHome />} />
        <Route path="/upload" element={<UploadBase />} />

        {/* <Route path="/home" element={<Home />} />
        <Route path="/members" element={<Members />} />
        <Route path="/player/:tag" element={<PlayerDetail />} />
        <Route path="/wars" element={<WarLog />} />
        <Route path="/capital" element={<CapitalRaids />} />
        <Route path="/others" element={<Others />} /> */}
      </Routes>
      <BottomNav />
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
