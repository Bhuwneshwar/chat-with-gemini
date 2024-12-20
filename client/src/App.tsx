import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";

import Home from "./pages/Home";
import UnAuthorizedPage from "./pages/UnAuthorizedPage";

function App() {
  return (
    <div className="main-app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:id?" element={<Dashboard />} />
        <Route path="/unauthorized" element={<UnAuthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
