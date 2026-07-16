const BASE = "http://localhost:5000/api";

export async function studentLogin(student_id: string, password: string) {
  const res = await fetch(`${BASE}/auth/student/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ student_id, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data; // { token, user, role }
}

export async function teacherLogin(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/teacher/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data; // { token, user, role }
}

// ─── Admin API ────────────────────────────────────────────────────────────────
const ADMIN = "http://localhost:5000/api/admin";

export async function fetchStudents() {
  const r = await fetch(`${ADMIN}/students`);
  if (!r.ok) throw new Error("Failed to load students");
  return r.json();
}
export async function fetchTeachers() {
  const r = await fetch(`${ADMIN}/teachers`);
  if (!r.ok) throw new Error("Failed to load teachers");
  return r.json();
}
export async function fetchCourses() {
  const r = await fetch(`${ADMIN}/courses`);
  if (!r.ok) throw new Error("Failed to load courses");
  return r.json();
}
export async function fetchDepartments() {
  const r = await fetch(`${ADMIN}/departments`);
  if (!r.ok) throw new Error("Failed to load departments");
  return r.json();
}
export async function fetchOfferings() {
  const r = await fetch(`${ADMIN}/offerings`);
  if (!r.ok) throw new Error("Failed to load offerings");
  return r.json();
}
export async function createOffering(payload: { course_id: number; teacher_id: string; student_ids: string[] }) {
  const r = await fetch(`${ADMIN}/offerings`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Failed to create offering");
  return data;
}
export async function deleteEnrollment(enrollment_id: number) {
  const r = await fetch(`${ADMIN}/offerings/${enrollment_id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete enrollment");
  return r.json();
}
