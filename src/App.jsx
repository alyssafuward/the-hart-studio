import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Schedule from "./pages/Schedule";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="*" element={<Navigate to="/schedule" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
