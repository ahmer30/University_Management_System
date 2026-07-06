// ─── Teacher mock data — mirrors ums_db.sql (TCH-001 = John Doe) ─────────────

export const teacherProfile = {
  id:           "TCH-001",
  name:         "John Doe",
  email:        "john.doe@ums.edu",
  designation:  "Professor",
  department:   "Computer Science",
  office:       "CS Block A-101",
  officeHours:  "Mon / Wed  2:00 – 4:00 PM",
  phone:        "+1-555-0101",
  dateJoined:   "August 1, 2015",
};

// Courses taught by TCH-001 this semester (from courses table, semester_id=1)
export const teacherCourses = [
  {
    id:          1,
    code:        "CS-401",
    title:       "Data Structures & Algorithms",
    room:        "A-201",
    schedule:    "Mon / Wed / Fri  9:00 AM",
    credits:     3,
    color:       "#6c63ff",
    studentCount: 4,   // from enrollments WHERE course_id=1 AND status='Enrolled'
    maxEnroll:   40,
  },
  {
    id:          5,
    code:        "CS-305",
    title:       "Operating Systems",
    room:        "A-210",
    schedule:    "Mon / Wed / Fri  11:00 AM",
    credits:     3,
    color:       "#29b6c8",
    studentCount: 3,
    maxEnroll:   40,
  },
];

// Students enrolled in each course (from enrollments + students tables)
export const courseStudents: Record<number, Student[]> = {
  1: [
    { id: "2021-CS-0042", name: "Alex Johnson"  },
    { id: "2021-CS-0011", name: "Sara Ahmed"    },
    { id: "2021-CS-0023", name: "Bilal Khan"    },
    { id: "2022-CS-0031", name: "Zainab Ali"    },
  ],
  5: [
    { id: "2021-CS-0042", name: "Alex Johnson"  },
    { id: "2021-CS-0055", name: "Noah Davis"    },
    { id: "2020-CS-0002", name: "Olivia Brown"  },
  ],
};

export interface Student {
  id:   string;
  name: string;
}

// Assessment types allowed
export const ASSESSMENT_TYPES = ["Quiz", "Assignment", "Exam", "Project", "Lab"] as const;
export type AssessmentType = typeof ASSESSMENT_TYPES[number];

// Assessment instances already created (from assessments + assessment_results tables)
export interface AssessmentInstance {
  id:          number;
  courseId:    number;
  title:       string;
  type:        AssessmentType;
  date:        string;
  totalMarks:  number;
  weightage:   number;
  // per-student results: studentId → marks obtained (null = pending)
  results:     Record<string, number | null>;
}

export const assessmentInstances: AssessmentInstance[] = [
  {
    id:         1,
    courseId:   1,
    title:      "Midterm Exam",
    type:       "Exam",
    date:       "2026-10-20",
    totalMarks: 100,
    weightage:  30,
    results: {
      "2021-CS-0042": 88,
      "2021-CS-0011": 76,
      "2021-CS-0023": 95,
      "2022-CS-0031": null,
    },
  },
  {
    id:         2,
    courseId:   1,
    title:      "Assignment 1",
    type:       "Assignment",
    date:       "2026-09-25",
    totalMarks: 50,
    weightage:  10,
    results: {
      "2021-CS-0042": 45,
      "2021-CS-0011": 40,
      "2021-CS-0023": 50,
      "2022-CS-0031": null,
    },
  },
  {
    id:         9,
    courseId:   5,
    title:      "Quiz 1",
    type:       "Quiz",
    date:       "2026-09-12",
    totalMarks: 20,
    weightage:  5,
    results: {
      "2021-CS-0042": 19,
      "2021-CS-0055": 12,
      "2020-CS-0002": null,
    },
  },
];

export const teacherNavItems = [
  { id: "dashboard",   label: "Dashboard",    icon: "home"     },
  { id: "courses",     label: "My Courses",   icon: "book"     },
  { id: "assessments", label: "Assessments",  icon: "chart"    },
  { id: "students",    label: "Students",     icon: "users"    },
  { id: "settings",    label: "Settings",     icon: "settings" },
];
