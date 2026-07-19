const BASE  = "http://localhost:5000/api";
const ADMIN = "http://localhost:5000/api/admin";

// ─── Auth ─────────────────────────────────────────────────────────────────────

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

// ─── Admin — Departments ──────────────────────────────────────────────────────

export async function fetchDepartments() {
  const r = await fetch(`${ADMIN}/departments`);
  if (!r.ok) throw new Error("Failed to load departments");
  return r.json();
}

export async function addDepartment(payload: { department_name: string }) {
  const r = await fetch(`${ADMIN}/departments`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Failed to add department");
  return data;
}

export async function deleteDepartment(department_id: number) {
  const r = await fetch(`${ADMIN}/departments/${department_id}`, { method: "DELETE" });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Failed to delete department");
  return data;
}

// ─── Admin — Programs ─────────────────────────────────────────────────────────

export async function fetchPrograms() {
  const r = await fetch(`${ADMIN}/programs`);
  if (!r.ok) throw new Error("Failed to load programs");
  return r.json();
}

// ─── Admin — Teachers ─────────────────────────────────────────────────────────

export async function fetchTeachers() {
  const r = await fetch(`${ADMIN}/teachers`);
  if (!r.ok) throw new Error("Failed to load teachers");
  return r.json();
}

export async function addTeacher(payload: {
  teacher_id: string;
  full_name: string;
  email: string;
  designation: string;
  department_id: number | null;
  office_location: string;
}) {
  const r = await fetch(`${ADMIN}/teachers`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Failed to add teacher");
  return data;
}

export async function deleteTeacher(teacher_id: string) {
  const r = await fetch(`${ADMIN}/teachers/${teacher_id}`, { method: "DELETE" });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Failed to delete teacher");
  return data;
}

// ─── Admin — Students ─────────────────────────────────────────────────────────

export async function fetchStudents() {
  const r = await fetch(`${ADMIN}/students`);
  if (!r.ok) throw new Error("Failed to load students");
  return r.json();
}

export async function addStudent(payload: {
  student_id: string;
  full_name: string;
  email: string;
  program_id: number;
  batch_year: number;
}) {
  const r = await fetch(`${ADMIN}/students`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Failed to add student");
  return data;
}

export async function deleteStudent(student_id: string) {
  const r = await fetch(`${ADMIN}/students/${student_id}`, { method: "DELETE" });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Failed to delete student");
  return data;
}

// ─── Admin — Courses ──────────────────────────────────────────────────────────

export async function fetchCourses() {
  const r = await fetch(`${ADMIN}/courses`);
  if (!r.ok) throw new Error("Failed to load courses");
  return r.json();
}

export async function addCourse(payload: {
  course_code: string;
  course_title: string;
  credits: number;
  department_id: number;
  room_location: string;
}) {
  const r = await fetch(`${ADMIN}/courses`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Failed to add course");
  return data;
}

export async function deleteCourse(course_id: number) {
  const r = await fetch(`${ADMIN}/courses/${course_id}`, { method: "DELETE" });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Failed to delete course");
  return data;
}

// ─── Admin — Offerings (Enrollments) ─────────────────────────────────────────

export async function fetchOfferings() {
  const r = await fetch(`${ADMIN}/offerings`);
  if (!r.ok) throw new Error("Failed to load offerings");
  return r.json();
}

export async function createOffering(payload: {
  course_id: number;
  teacher_id: string;
  student_ids: string[];
}) {
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
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Failed to delete enrollment");
  return data;
}
