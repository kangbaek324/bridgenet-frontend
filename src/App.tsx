import { BrowserRouter, Routes, Route } from "react-router-dom";
import BridgePage from "./pages/BridgePage";
import ExplorePage from "./pages/ExplorePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<BridgePage />}></Route>
          <Route path="/explore" element={<ExplorePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;