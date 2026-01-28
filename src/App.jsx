import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import HomeCOC from "./pages/HomeCOC";
import Tess from "./pages/Tess";
import Page2 from "./pages/page2";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="admin" element={<Dashboard />} />

        <Route path="/coc" element={<HomeCOC />} />
        <Route path="/tes" element={<Tess />} />
        <Route path="/clan" element={<Page2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
