import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;