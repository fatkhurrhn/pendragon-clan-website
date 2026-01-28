import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Members from './pages/Members';
import PlayerDetail from './pages/PlayerDetail';
import WarLog from './pages/WarLog';
import CapitalRaids from './pages/CapitalRaids';
import Others from './pages/Others';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Members />} />
        <Route path="/player/:tag" element={<PlayerDetail />} />
        <Route path="/wars" element={<WarLog />} />
        <Route path="/capital" element={<CapitalRaids />} />
        <Route path="/others" element={<Others />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;
