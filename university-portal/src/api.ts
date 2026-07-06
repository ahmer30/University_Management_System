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
