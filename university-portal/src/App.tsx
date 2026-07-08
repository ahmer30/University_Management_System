import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PortalSelect     from "./components/PortalSelect";
import StudentLogin     from "./student/Login";
import TeacherLogin     from "./teacher/Login";
import AdminLogin       from "./admin/Login";
import StudentDashboard from "./student/Dashboard";
import TeacherDashboard from "./teacher/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<PortalSelect />} />
        <Route path="/student/login"     element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/teacher/login"     element={<TeacherLogin />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/admin/login"       element={<AdminLogin />} />
        <Route path="*"                  element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
