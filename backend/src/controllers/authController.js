const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const db     = require("../db");
require("dotenv").config();

// ─── Student Login ────────────────────────────────────────────────────────────
// Credentials: student_id (roll number) + password
async function studentLogin(req, res) {
  const { student_id, password } = req.body;

  if (!student_id || !password) {
    return res.status(400).json({ error: "Student ID and password are required" });
  }

  try {
    const [rows] = await db.query(
      `SELECT s.student_id, s.full_name, s.email, s.password_hash,
              s.status, s.current_semester, s.batch_year,
              p.program_name,
              CONCAT(t.full_name) AS advisor_name
       FROM   students s
       JOIN   programs  p ON p.program_id  = s.program_id
       LEFT JOIN teachers t ON t.teacher_id = s.advisor_id
       WHERE  s.student_id = ?`,
      [student_id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid student ID or password" });
    }

    const student = rows[0];

    if (student.status === "Suspended") {
      return res.status(403).json({ error: "Your account has been suspended" });
    }

    const match = await bcrypt.compare(password, student.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid student ID or password" });
    }

    const token = jwt.sign(
      { id: student.student_id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove hash before sending
    delete student.password_hash;

    return res.json({ token, user: student, role: "student" });

  } catch (err) {
    console.error("studentLogin error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// ─── Teacher Login ────────────────────────────────────────────────────────────
// Credentials: email (t.name@ums.edu format) + password
async function teacherLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [rows] = await db.query(
      `SELECT t.teacher_id, t.full_name, t.email, t.password_hash,
              t.designation, t.office_location, t.office_hours, t.status,
              d.department_name
       FROM   teachers t
       LEFT JOIN departments d ON d.department_id = t.department_id
       WHERE  t.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const teacher = rows[0];

    if (teacher.status !== "Active") {
      return res.status(403).json({ error: "Your account is not active" });
    }

    const match = await bcrypt.compare(password, teacher.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: teacher.teacher_id, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    delete teacher.password_hash;

    return res.json({ token, user: teacher, role: "teacher" });

  } catch (err) {
    console.error("teacherLogin error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// ─── Verify token (used by frontend on page load) ─────────────────────────────
async function verifyToken(req, res) {
  // req.user is already decoded by authenticate middleware
  return res.json({ valid: true, user: req.user });
}

module.exports = { studentLogin, teacherLogin, verifyToken };
