// ─── Student Portal Data — mirrors ums_db.sql ───────────────────────────────────

export const studentProfile = {
  name:           "Student CS 2026 1",
  id:             "NUM-CS-2026-01",
  program:        "BS Computer Science",
  semester:       "Fall 2026",
  currentSem:     1,
  batchYear:      2026,
  gpa:            0.00,
  email:          "student.cs.2026.1@namal.edu.pk",
  phone:          "+92-300-1112223",
  dob:            "January 1, 2005",
  address:        "Namal University, Mianwali",
  advisor:        "Teacher CS 3",
  enrollmentDate: "September 1, 2026",
  status:         "Active",
  avatar:         null as string | null,
};

const COURSE_COLORS: Record<string, string> = {
  "CR-001":  "#6c63ff",
  "CR-005":  "#48c97e",
  "CR-009":  "#f5a623",
  "CR-013":  "#e05c5c",
};

export const courses = [
  {
    id:         1,
    code:       "CR-001",
    title:      "Calculus I",
    instructor: "Teacher CS 5",
    teacherId:  "TCH-CS-05",
    credits:    3,
    room:       "CS-101",
    schedule:   "Mon / Wed / Fri  9:00 AM",
    description:"Foundational calculus and mathematical analysis",
    progress:   15,
    grade:      null as string|null,
    currentMark:"—",
    color:      COURSE_COLORS["CR-001"],
    enrolled:   true,
  },
  {
    id:         5,
    code:       "CR-005",
    title:      "Differential Equations",
    instructor: "Teacher CS 2",
    teacherId:  "TCH-CS-02",
    credits:    3,
    room:       "CS-105",
    schedule:   "Tue / Thu  11:00 AM",
    description:"Solving first and second order differential equations",
    progress:   10,
    grade:      null as string|null,
    currentMark:"—",
    color:      COURSE_COLORS["CR-005"],
    enrolled:   true,
  },
];

export const navItems = [
  { id: "dashboard",  label: "Dashboard",              icon: "home"     },
  { id: "courses",    label: "My Courses",             icon: "book"     },
  { id: "grades",     label: "Grades",                 icon: "chart"    },
  { id: "attendance", label: "Attendance",             icon: "calendar" },
  { id: "timetable",  label: "Timetable",              icon: "clock"    },
  { id: "messages",   label: "Messages",               icon: "mail"     },
  { id: "settings",   label: "Settings",               icon: "settings" },
];

export const announcements = [
  { courseCode: "CR-001", title: "Welcome to Calculus", body: "Course outline is now available in the resources section.", pinned: true },
  { courseCode: "CR-005", title: "Quiz 1 Date", body: "First quiz will be held next Tuesday.", pinned: false },
];

export const upcomingAssessments = [
  { courseCode: "CR-001", title: "Assignment 1", type: "Assignment", dueDate: "Oct 12", weightage: 10 },
  { courseCode: "CR-005", title: "Quiz 1", type: "Quiz", dueDate: "Oct 15", weightage: 5 },
];

export interface Student {
  id:      string;
  name:    string;
  program: string;
  dept:    string;
}
