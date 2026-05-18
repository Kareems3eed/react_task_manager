import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;