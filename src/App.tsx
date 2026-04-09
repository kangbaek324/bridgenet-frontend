import { BrowserRouter, Routes, Route } from "react-router-dom";
import BridgePage from "./pages/BridgePage";
import ExplorePage from "./pages/ExplorePage";
import LogDetailPage from "./pages/LogDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BridgePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/log/:id" element={<LogDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
