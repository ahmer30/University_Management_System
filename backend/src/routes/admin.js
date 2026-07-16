const express = require("express");
const router  = express.Router();
const {
  getStudents, getTeachers, getCourses, getDepartments,
  createOffering, getOfferings, deleteEnrollment,
} = require("../controllers/adminController");

// Dropdown data
router.get("/students",    getStudents);
router.get("/teachers",    getTeachers);
router.get("/courses",     getCourses);
router.get("/departments", getDepartments);

// Offerings (enrollments)
router.get("/offerings",                        getOfferings);
router.post("/offerings",                       createOffering);
router.delete("/offerings/:enrollment_id",      deleteEnrollment);

module.exports = router;
