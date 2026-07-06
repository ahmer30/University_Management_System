// ─── All data mirrors ums_db.sql exactly ─────────────────────────────────────
// When the backend is ready, these will be replaced by API calls.
// student_id: 2021-CS-0042  |  advisor: TCH-001 = John Doe

export const studentProfile = {
  name:           "Alex Johnson",
  id:             "2021-CS-0042",
  program:        "BS Computer Science",
  semester:       "Fall 2026",
  currentSem:     7,
  batchYear:      2021,
  gpa:            3.75,               // from transcripts table
  email:          "alex.johnson@ums.edu",
  phone:          "+1-555-1001",
  dob:            "March 15, 2003",   // 2003-03-15 in DB
  address:        "221 Baker St",
  advisor:        "Prof. John Doe",   // TCH-001
  enrollmentDate: "September 1, 2021",
  status:         "Active",
  avatar:         null as string | null,
};

// ─── Course colors (UI only — not in DB) ────────────────────────────────────
const COURSE_COLORS: Record<string, string> = {
  "CS-401":  "#6c63ff",
  "MATH-202":"#48c97e",
  "ENG-101": "#f5a623",
  "PHY-301": "#e05c5c",
  "CS-305":  "#29b6c8",
  "CS-410":  "#9b59b6",
};

// ─── Courses (mirrors courses + timetables + teachers + enrollments tables) ──
// progress = assessments graded / total assessments * 100  (estimated here)
// grade    = enrollments.final_grade (NULL = in progress, shown as current est.)
export const courses = [
  {
    id:         1,                   // courses.course_id
    code:       "CS-401",
    title:      "Data Structures & Algorithms",
    instructor: "Prof. John Doe",    // TCH-001
    teacherId:  "TCH-001",
    credits:    3,
    room:       "A-201",
    schedule:   "Mon / Wed / Fri  9:00 AM",   // from timetables rows
    description:"Core DSA concepts and problem solving",
    progress:   40,                  // 2 of 5 assessments graded → 40 %
    grade:      null as string|null, // still enrolled, no final grade yet
    currentMark:"88 / 100",          // latest graded exam result
    color:      COURSE_COLORS["CS-401"],
    enrolled:   true,
    maxEnroll:  40,
  },
  {
    id:         2,
    code:       "MATH-202",
    title:      "Discrete Mathematics",
    instructor: "Dr. Emily Carter",  // TCH-002
    teacherId:  "TCH-002",
    credits:    3,
    room:       "B-101",
    schedule:   "Tue / Thu  11:00 AM",
    description:"Logic, sets, combinatorics, graph theory",
    progress:   40,                  // 2 of 5 assessments graded
    grade:      null as string|null,
    currentMark:"—",
    color:      COURSE_COLORS["MATH-202"],
    enrolled:   true,
    maxEnroll:  50,
  },
  {
    id:         3,
    code:       "ENG-101",
    title:      "Technical Writing",
    instructor: "Prof. Maria Garcia",// TCH-003
    teacherId:  "TCH-003",
    credits:    2,
    room:       "A-303",
    schedule:   "Mon / Wed  1:00 PM",
    description:"Professional and technical communication",
    progress:   33,                  // 1 of 3 assessments graded
    grade:      null as string|null,
    currentMark:"—",
    color:      COURSE_COLORS["ENG-101"],
    enrolled:   true,
    maxEnroll:  45,
  },
  {
    id:         4,
    code:       "PHY-301",
    title:      "Physics for Engineers",
    instructor: "Dr. Alan Reed",     // TCH-004
    teacherId:  "TCH-004",
    credits:    3,                   // corrected from 4 → 3 in DB
    room:       "C-105",
    schedule:   "Tue / Thu  2:00 PM",
    description:"Mechanics and electromagnetism for engineers",
    progress:   25,                  // 1 of 4 assessments graded
    grade:      null as string|null,
    currentMark:"—",
    color:      COURSE_COLORS["PHY-301"],
    enrolled:   true,
    maxEnroll:  35,
  },
  {
    id:         5,
    code:       "CS-305",
    title:      "Operating Systems",
    instructor: "Prof. David Kim",   // TCH-005
    teacherId:  "TCH-005",
    credits:    3,
    room:       "A-210",
    schedule:   "Mon / Wed / Fri  11:00 AM",
    description:"Processes, memory, scheduling, file systems",
    progress:   50,                  // 1 of 2 assessments graded (quiz done)
    grade:      null as string|null,
    currentMark:"19 / 20",
    color:      COURSE_COLORS["CS-305"],
    enrolled:   true,
    maxEnroll:  40,
  },
  {
    id:         6,
    code:       "CS-410",
    title:      "Computer Networks",
    instructor: "Dr. Nina Patel",    // TCH-006
    teacherId:  "TCH-006",
    credits:    3,
    room:       "A-215",
    schedule:   "Fri  2:00 PM",
    description:"Network protocols, architecture, security",
    progress:   0,                   // no results yet for Alex
    grade:      null as string|null,
    currentMark:"—",
    color:      COURSE_COLORS["CS-410"],
    enrolled:   true,
    maxEnroll:  40,
  },
];

// ─── Sidebar navigation items ─────────────────────────────────────────────────
export const navItems = [
  { id: "dashboard",  label: "Dashboard",              icon: "home"     },
  { id: "courses",    label: "My Courses",             icon: "book"     },
  { id: "grades",     label: "Grades",                 icon: "chart"    },
  { id: "attendance", label: "Attendance",             icon: "calendar" },
  { id: "timetable",  label: "Timetable",              icon: "clock"    },
  { id: "messages",   label: "Messages",               icon: "mail"     },
  { id: "settings",   label: "Settings",               icon: "settings" },
];

// ─── Announcements for dashboard feed (from announcements table) ─────────────
export const announcements = [
  { courseCode: "CS-401", title: "Midterm Schedule",      body: "Midterm exam on Oct 20 in A-201.",          pinned: true  },
  { courseCode: "MATH-202",title:"Quiz Reminder",         body: "Quiz 1 covers Chapters 1-2.",               pinned: false },
  { courseCode: "ENG-101", title: "Essay Deadline Extended", body: "New deadline for Essay 1 is Oct 2.",     pinned: true  },
  { courseCode: "PHY-301", title: "Lab Safety Briefing",  body: "Mandatory safety briefing before Lab 1.",   pinned: true  },
  { courseCode: "CS-305",  title: "Project Groups",       body: "Project groups posted on the portal.",      pinned: false },
  { courseCode: "CS-410",  title: "Guest Lecture",        body: "Guest lecture on network security Friday.", pinned: false },
];

// ─── Upcoming assessments / deadlines (from assessments table) ───────────────
export const upcomingAssessments = [
  { courseCode: "CS-401",   title: "Midterm Exam",    type: "Exam",       dueDate: "Oct 20", weightage: 30 },
  { courseCode: "MATH-202", title: "Midterm Exam",    type: "Exam",       dueDate: "Oct 22", weightage: 30 },
  { courseCode: "ENG-101",  title: "Essay 1",         type: "Assignment", dueDate: "Sep 30", weightage: 20 },
  { courseCode: "PHY-301",  title: "Lab 1",           type: "Lab",        dueDate: "Sep 18", weightage: 10 },
  { courseCode: "CS-305",   title: "Project",         type: "Project",    dueDate: "Nov 30", weightage: 35 },
  { courseCode: "CS-410",   title: "Assignment 1",    type: "Assignment", dueDate: "Sep 28", weightage: 15 },
];
