const db = require("../db");

// ── GET /api/admin/students ───────────────────────────────────────────────────
// Returns all students with their program, department, batch_year
async function getStudents(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT
        s.student_id,
        s.full_name,
        s.batch_year,
        p.program_name,
        d.department_name
      FROM students s
      JOIN programs    p ON p.program_id    = s.program_id
      JOIN departments d ON d.department_id = p.department_id
      WHERE s.status = 'Active'
      ORDER BY s.batch_year DESC, s.student_id
    `);
    res.json(rows);
  } catch (err) {
    console.error("getStudents:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── GET /api/admin/teachers ───────────────────────────────────────────────────
async function getTeachers(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT
        t.teacher_id,
        t.full_name,
        t.email,
        t.designation,
        d.department_name
      FROM teachers t
      LEFT JOIN departments d ON d.department_id = t.department_id
      WHERE t.status = 'Active'
      ORDER BY t.full_name
    `);
    res.json(rows);
  } catch (err) {
    console.error("getTeachers:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── GET /api/admin/courses ────────────────────────────────────────────────────
async function getCourses(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT
        c.course_id,
        c.course_code,
        c.course_title,
        c.credits,
        d.department_name,
        t.full_name AS teacher_name
      FROM courses c
      JOIN departments d ON d.department_id = c.department_id
      LEFT JOIN teachers t ON t.teacher_id  = c.teacher_id
      ORDER BY c.course_code
    `);
    res.json(rows);
  } catch (err) {
    console.error("getCourses:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── GET /api/admin/departments ────────────────────────────────────────────────
async function getDepartments(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT department_id, department_name FROM departments ORDER BY department_name
    `);
    res.json(rows);
  } catch (err) {
    console.error("getDepartments:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── POST /api/admin/offerings ─────────────────────────────────────────────────
// Body: { course_id, teacher_id, student_ids: string[] }
// Inserts one enrollment row per student. Skips duplicates (already enrolled).
async function createOffering(req, res) {
  const { course_id, teacher_id, student_ids } = req.body;

  if (!course_id || !teacher_id || !Array.isArray(student_ids) || student_ids.length === 0) {
    return res.status(400).json({ error: "course_id, teacher_id and student_ids are required" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Update the course's assigned teacher
    await conn.query(
      `UPDATE courses SET teacher_id = ? WHERE course_id = ?`,
      [teacher_id, course_id]
    );

    // 2. Insert enrollments — use INSERT IGNORE to skip duplicates
    const today = new Date().toISOString().slice(0, 10);
    let inserted = 0;
    let skipped  = 0;

    for (const student_id of student_ids) {
      const [result] = await conn.query(
        `INSERT IGNORE INTO enrollments (student_id, course_id, enrollment_date, status)
         VALUES (?, ?, ?, 'Enrolled')`,
        [student_id, course_id, today]
      );
      if (result.affectedRows > 0) inserted++;
      else skipped++;
    }

    await conn.commit();
    res.json({
      message: `Offering saved. ${inserted} student(s) enrolled, ${skipped} already existed.`,
      inserted,
      skipped,
    });
  } catch (err) {
    await conn.rollback();
    console.error("createOffering:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    conn.release();
  }
}

// ── GET /api/admin/offerings ──────────────────────────────────────────────────
// Returns all enrollments grouped by course — for the "Offered Courses" view
async function getOfferings(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT
        e.enrollment_id,
        e.student_id,
        s.full_name          AS student_name,
        s.batch_year,
        p.program_name,
        d.department_name,
        c.course_id,
        c.course_code,
        c.course_title,
        c.credits,
        t.teacher_id,
        t.full_name          AS teacher_name,
        e.enrollment_date,
        e.status
      FROM enrollments e
      JOIN students    s ON s.student_id    = e.student_id
      JOIN programs    p ON p.program_id    = s.program_id
      JOIN departments d ON d.department_id = p.department_id
      JOIN courses     c ON c.course_id     = e.course_id
      LEFT JOIN teachers t ON t.teacher_id  = c.teacher_id
      ORDER BY c.course_code, s.batch_year, s.student_id
    `);

    // Group by course_id
    const grouped = {};
    for (const row of rows) {
      const key = row.course_id;
      if (!grouped[key]) {
        grouped[key] = {
          course_id:    row.course_id,
          course_code:  row.course_code,
          course_title: row.course_title,
          credits:      row.credits,
          teacher_name: row.teacher_name,
          students:     [],
        };
      }
      grouped[key].students.push({
        enrollment_id:   row.enrollment_id,
        student_id:      row.student_id,
        student_name:    row.student_name,
        batch_year:      row.batch_year,
        program_name:    row.program_name,
        department_name: row.department_name,
        status:          row.status,
        enrollment_date: row.enrollment_date,
      });
    }

    res.json(Object.values(grouped));
  } catch (err) {
    console.error("getOfferings:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── DELETE /api/admin/offerings/:enrollment_id ────────────────────────────────
async function deleteEnrollment(req, res) {
  const { enrollment_id } = req.params;
  try {
    await db.query(`DELETE FROM enrollments WHERE enrollment_id = ?`, [enrollment_id]);
    res.json({ message: "Enrollment removed." });
  } catch (err) {
    console.error("deleteEnrollment:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getStudents, getTeachers, getCourses, getDepartments, createOffering, getOfferings, deleteEnrollment };
