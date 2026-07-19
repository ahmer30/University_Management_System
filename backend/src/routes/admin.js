const express = require("express");
const router  = express.Router();
const {
  getPrograms,
  getStudents, addStudent, deleteStudent,
  getTeachers, addTeacher, deleteTeacher,
  getCourses,  addCourse,  deleteCourse,
  getDepartments, addDepartment, deleteDepartment,
  createOffering, getOfferings, deleteEnrollment,
} = require("../controllers/adminController");

// Lookup data
router.get("/programs",               getPrograms);
router.get("/departments",            getDepartments);

// Students CRUD
router.get("/students",               getStudents);
router.post("/students",              addStudent);
router.delete("/students/:student_id", deleteStudent);

// Teachers CRUD
router.get("/teachers",               getTeachers);
router.post("/teachers",              addTeacher);
router.delete("/teachers/:teacher_id", deleteTeacher);

// Courses CRUD
router.get("/courses",                getCourses);
router.post("/courses",               addCourse);
router.delete("/courses/:course_id",  deleteCourse);

// Departments CRUD
router.post("/departments",                   addDepartment);
router.delete("/departments/:department_id",  deleteDepartment);

// Offerings (enrollments)
router.get("/offerings",                      getOfferings);
router.post("/offerings",                     createOffering);
router.delete("/offerings/:enrollment_id",    deleteEnrollment);

module.exports = router;
