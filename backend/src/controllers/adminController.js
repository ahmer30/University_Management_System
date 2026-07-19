const bcrypt = require("bcryptjs");
const db = require("../db");

// ── GET /api/admin/programs ───────────────────────────────────────────────────
async function getPrograms(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT p.program_id, p.program_name, p.duration_years, p.total_credits,
             d.department_name
      FROM programs p
      JOIN departments d ON d.department_id = p.department_id
      ORDER BY p.program_name
    `);
    res.json(rows);
  } catch (err) {
    console.error("getPrograms:", err);
    res.status(500).json({ error: "Server error" });
  }
}

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
      SELECT d.department_id, d.department_name, t.full_name AS hod_name
      FROM departments d
      LEFT JOIN teachers t ON t.teacher_id = d.hod_id
      ORDER BY d.department_name
    `);
    res.json(rows);
  } catch (err) {
    console.error("getDepartments:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── POST /api/admin/departments ───────────────────────────────────────────────
async function addDepartment(req, res) {
  const { department_name } = req.body;
  if (!department_name) return res.status(400).json({ error: "department_name is required" });
  try {
    const [result] = await db.query(
      `INSERT INTO departments (department_name) VALUES (?)`, [department_name]
    );
    res.status(201).json({ department_id: result.insertId, department_name });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Department already exists" });
    console.error("addDepartment:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── DELETE /api/admin/departments/:department_id ──────────────────────────────
async function deleteDepartment(req, res) {
  const { department_id } = req.params;
  try {
    await db.query(`DELETE FROM departments WHERE department_id = ?`, [department_id]);
    res.json({ message: "Department deleted." });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ error: "Cannot delete — department has linked records." });
    }
    console.error("deleteDepartment:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── POST /api/admin/teachers ──────────────────────────────────────────────────
// Body: { teacher_id, full_name, email, designation, department_id, office_location }
async function addTeacher(req, res) {
  const { teacher_id, full_name, email, designation, department_id, office_location } = req.body;
  if (!teacher_id || !full_name || !email || !designation) {
    return res.status(400).json({ error: "teacher_id, full_name, email, designation are required" });
  }
  try {
    // Default password: "password123"
    const password_hash = await bcrypt.hash("password123", 12);
    await db.query(
      `INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, office_location, date_joined)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [teacher_id, full_name, email, password_hash, department_id || null, designation, office_location || null]
    );
    res.status(201).json({ message: "Teacher added.", teacher_id });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Teacher ID or email already exists." });
    console.error("addTeacher:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── DELETE /api/admin/teachers/:teacher_id ────────────────────────────────────
async function deleteTeacher(req, res) {
  const { teacher_id } = req.params;
  try {
    await db.query(`DELETE FROM teachers WHERE teacher_id = ?`, [teacher_id]);
    res.json({ message: "Teacher deleted." });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ error: "Cannot delete — teacher has linked records." });
    }
    console.error("deleteTeacher:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── POST /api/admin/students ──────────────────────────────────────────────────
// Body: { student_id, full_name, email, program_id, batch_year }
async function addStudent(req, res) {
  const { student_id, full_name, email, program_id, batch_year } = req.body;
  if (!student_id || !full_name || !email || !program_id || !batch_year) {
    return res.status(400).json({ error: "student_id, full_name, email, program_id, batch_year are required" });
  }
  try {
    const password_hash = await bcrypt.hash("password123", 12);
    await db.query(
      `INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year)
       VALUES (?, ?, '2000-01-01', 'Male', ?, ?, ?, CURDATE(), 1, ?)`,
      [student_id, full_name, email, password_hash, program_id, batch_year]
    );
    res.status(201).json({ message: "Student registered.", student_id });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Student ID or email already exists." });
    console.error("addStudent:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── DELETE /api/admin/students/:student_id ────────────────────────────────────
async function deleteStudent(req, res) {
  const { student_id } = req.params;
  try {
    await db.query(`DELETE FROM students WHERE student_id = ?`, [student_id]);
    res.json({ message: "Student deleted." });
  } catch (err) {
    console.error("deleteStudent:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── POST /api/admin/courses ───────────────────────────────────────────────────
// Body: { course_code, course_title, credits, department_id, room_location }
async function addCourse(req, res) {
  const { course_code, course_title, credits, department_id, room_location } = req.body;
  if (!course_code || !course_title || !credits || !department_id) {
    return res.status(400).json({ error: "course_code, course_title, credits, department_id are required" });
  }
  try {
    // Use the current semester
    const [[semester]] = await db.query(`SELECT semester_id FROM semesters WHERE is_current = TRUE LIMIT 1`);
    const semester_id = semester?.semester_id;
    if (!semester_id) return res.status(400).json({ error: "No current semester found." });

    const [result] = await db.query(
      `INSERT INTO courses (course_code, course_title, credits, department_id, semester_id, room_location)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [course_code, course_title, credits, department_id, semester_id, room_location || null]
    );
    res.status(201).json({ message: "Course added.", course_id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Course code already exists." });
    console.error("addCourse:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ── DELETE /api/admin/courses/:course_id ──────────────────────────────────────
async function deleteCourse(req, res) {
  const { course_id } = req.params;
  try {
    await db.query(`DELETE FROM courses WHERE course_id = ?`, [course_id]);
    res.json({ message: "Course deleted." });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ error: "Cannot delete — course has enrollments." });
    }
    console.error("deleteCourse:", err);
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

module.exports = {
  getPrograms,
  getStudents, addStudent, deleteStudent,
  getTeachers, addTeacher, deleteTeacher,
  getCourses,  addCourse,  deleteCourse,
  getDepartments, addDepartment, deleteDepartment,
  createOffering, getOfferings, deleteEnrollment,
};
