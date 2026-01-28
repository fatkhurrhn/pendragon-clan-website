import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeCOC from "./pages/HomeCOC";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeCOC />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
