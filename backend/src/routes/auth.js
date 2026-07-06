const express    = require("express");
const router     = express.Router();
const { studentLogin, teacherLogin, verifyToken } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

// POST /api/auth/student/login
router.post("/student/login", studentLogin);

// POST /api/auth/teacher/login
router.post("/teacher/login", teacherLogin);

// GET  /api/auth/verify  (protected — checks token validity)
router.get("/verify", authenticate, verifyToken);

module.exports = router;
