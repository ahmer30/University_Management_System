// ─── Admin Portal Data — mirrors updated ums_db.sql ───────────────────────────────────

export const adminNavItems = [
  { id: "overview",    label: "Overview",         icon: "home"     },
  { id: "teachers",    label: "Teachers",         icon: "users"    },
  { id: "students",    label: "Students",         icon: "graduate" },
  { id: "courses",     label: "Courses",          icon: "book"     },
  { id: "departments", label: "Departments",      icon: "building" },
  { id: "manage",      label: "Manage Offerings", icon: "plus"     },
  { id: "offerings",   label: "Offered Courses",  icon: "list"     },
];

export const departments = [
  { id: 1, name: "Computer Science", hod: "Teacher CS 1", code: "CS", color: "#6c63ff", students: 20, courses: 7 },
  { id: 2, name: "Electrical Engineering", hod: "Teacher EE 1", code: "EE", color: "#e05c5c", students: 20, courses: 7 },
  { id: 3, name: "Mathematics", hod: "Teacher MATH 1", code: "MATH", color: "#48c97e", students: 20, courses: 7 },
  { id: 4, name: "Business Administration", hod: "Teacher BBA 1", code: "BBA", color: "#f5a623", students: 20, courses: 7 },
];

export const teachers = [
  { id: "TCH-CS-01", name: "Teacher CS 1", email: "teacher.cs.1@namal.edu.pk", designation: "Dr.", dept: "Computer Science", office: "CS Block, Room 101", status: "Active" },
  { id: "TCH-CS-02", name: "Teacher CS 2", email: "teacher.cs.2@namal.edu.pk", designation: "Dr.", dept: "Computer Science", office: "CS Block, Room 102", status: "Active" },
  { id: "TCH-CS-03", name: "Teacher CS 3", email: "teacher.cs.3@namal.edu.pk", designation: "Dr.", dept: "Computer Science", office: "CS Block, Room 103", status: "Active" },
  { id: "TCH-CS-04", name: "Teacher CS 4", email: "teacher.cs.4@namal.edu.pk", designation: "Dr.", dept: "Computer Science", office: "CS Block, Room 104", status: "Active" },
  { id: "TCH-CS-05", name: "Teacher CS 5", email: "teacher.cs.5@namal.edu.pk", designation: "Dr.", dept: "Computer Science", office: "CS Block, Room 105", status: "Active" },
  { id: "TCH-EE-01", name: "Teacher EE 1", email: "teacher.ee.1@namal.edu.pk", designation: "Dr.", dept: "Electrical Engineering", office: "EE Block, Room 101", status: "Active" },
  { id: "TCH-EE-02", name: "Teacher EE 2", email: "teacher.ee.2@namal.edu.pk", designation: "Dr.", dept: "Electrical Engineering", office: "EE Block, Room 102", status: "Active" },
  { id: "TCH-EE-03", name: "Teacher EE 3", email: "teacher.ee.3@namal.edu.pk", designation: "Dr.", dept: "Electrical Engineering", office: "EE Block, Room 103", status: "Active" },
  { id: "TCH-EE-04", name: "Teacher EE 4", email: "teacher.ee.4@namal.edu.pk", designation: "Dr.", dept: "Electrical Engineering", office: "EE Block, Room 104", status: "Active" },
  { id: "TCH-EE-05", name: "Teacher EE 5", email: "teacher.ee.5@namal.edu.pk", designation: "Dr.", dept: "Electrical Engineering", office: "EE Block, Room 105", status: "Active" },
  { id: "TCH-MATH-01", name: "Teacher MATH 1", email: "teacher.math.1@namal.edu.pk", designation: "Dr.", dept: "Mathematics", office: "MATH Block, Room 101", status: "Active" },
  { id: "TCH-MATH-02", name: "Teacher MATH 2", email: "teacher.math.2@namal.edu.pk", designation: "Dr.", dept: "Mathematics", office: "MATH Block, Room 102", status: "Active" },
  { id: "TCH-MATH-03", name: "Teacher MATH 3", email: "teacher.math.3@namal.edu.pk", designation: "Dr.", dept: "Mathematics", office: "MATH Block, Room 103", status: "Active" },
  { id: "TCH-MATH-04", name: "Teacher MATH 4", email: "teacher.math.4@namal.edu.pk", designation: "Dr.", dept: "Mathematics", office: "MATH Block, Room 104", status: "Active" },
  { id: "TCH-MATH-05", name: "Teacher MATH 5", email: "teacher.math.5@namal.edu.pk", designation: "Dr.", dept: "Mathematics", office: "MATH Block, Room 105", status: "Active" },
  { id: "TCH-BBA-01", name: "Teacher BBA 1", email: "teacher.bba.1@namal.edu.pk", designation: "Dr.", dept: "Business Administration", office: "BBA Block, Room 101", status: "Active" },
  { id: "TCH-BBA-02", name: "Teacher BBA 2", email: "teacher.bba.2@namal.edu.pk", designation: "Dr.", dept: "Business Administration", office: "BBA Block, Room 102", status: "Active" },
  { id: "TCH-BBA-03", name: "Teacher BBA 3", email: "teacher.bba.3@namal.edu.pk", designation: "Dr.", dept: "Business Administration", office: "BBA Block, Room 103", status: "Active" },
  { id: "TCH-BBA-04", name: "Teacher BBA 4", email: "teacher.bba.4@namal.edu.pk", designation: "Dr.", dept: "Business Administration", office: "BBA Block, Room 104", status: "Active" },
  { id: "TCH-BBA-05", name: "Teacher BBA 5", email: "teacher.bba.5@namal.edu.pk", designation: "Dr.", dept: "Business Administration", office: "BBA Block, Room 105", status: "Active" },
];

export const courses = [
  { id: 1, code: "CR-001", title: "Calculus I", dept: "Computer Science", teacher: "Teacher CS 1", credits: 3, enrolled: 20, room: "CS-101", color: "#6c63ff" },
  { id: 2, code: "CR-002", title: "Calculus II", dept: "Electrical Engineering", teacher: "Teacher EE 1", credits: 3, enrolled: 20, room: "EE-102", color: "#e05c5c" },
  { id: 3, code: "CR-003", title: "Calculus III", dept: "Mathematics", teacher: "Teacher MATH 1", credits: 3, enrolled: 20, room: "MATH-103", color: "#48c97e" },
  { id: 4, code: "CR-004", title: "Linear Algebra", dept: "Business Administration", teacher: "Teacher BBA 1", credits: 3, enrolled: 20, room: "BBA-104", color: "#f5a623" },
  { id: 5, code: "CR-005", title: "Differential Equations", dept: "Computer Science", teacher: "Teacher CS 1", credits: 3, enrolled: 20, room: "CS-105", color: "#6c63ff" },
  { id: 6, code: "CR-006", title: "Programming Fundamentals", dept: "Electrical Engineering", teacher: "Teacher EE 1", credits: 3, enrolled: 20, room: "EE-106", color: "#e05c5c" },
  { id: 7, code: "CR-007", title: "Object Oriented Programming", dept: "Mathematics", teacher: "Teacher MATH 1", credits: 3, enrolled: 20, room: "MATH-107", color: "#48c97e" },
  { id: 8, code: "CR-008", title: "Data Structures", dept: "Business Administration", teacher: "Teacher BBA 1", credits: 3, enrolled: 20, room: "BBA-108", color: "#f5a623" },
  { id: 9, code: "CR-009", title: "Algorithms", dept: "Computer Science", teacher: "Teacher CS 1", credits: 3, enrolled: 20, room: "CS-109", color: "#6c63ff" },
  { id: 10, code: "CR-010", title: "Operating Systems", dept: "Electrical Engineering", teacher: "Teacher EE 1", credits: 3, enrolled: 20, room: "EE-110", color: "#e05c5c" },
  { id: 11, code: "CR-011", title: "Database Systems", dept: "Mathematics", teacher: "Teacher MATH 1", credits: 3, enrolled: 20, room: "MATH-111", color: "#48c97e" },
  { id: 12, code: "CR-012", title: "Software Engineering", dept: "Business Administration", teacher: "Teacher BBA 1", credits: 3, enrolled: 20, room: "BBA-112", color: "#f5a623" },
  { id: 13, code: "CR-013", title: "Computer Networks", dept: "Computer Science", teacher: "Teacher CS 1", credits: 3, enrolled: 20, room: "CS-113", color: "#6c63ff" },
  { id: 14, code: "CR-014", title: "Artificial Intelligence", dept: "Electrical Engineering", teacher: "Teacher EE 1", credits: 3, enrolled: 20, room: "EE-114", color: "#e05c5c" },
  { id: 15, code: "CR-015", title: "Machine Learning", dept: "Mathematics", teacher: "Teacher MATH 1", credits: 3, enrolled: 20, room: "MATH-115", color: "#48c97e" },
  { id: 16, code: "CR-016", title: "Electric Circuits", dept: "Business Administration", teacher: "Teacher BBA 1", credits: 3, enrolled: 20, room: "BBA-116", color: "#f5a623" },
  { id: 17, code: "CR-017", title: "Digital Logic Design", dept: "Computer Science", teacher: "Teacher CS 1", credits: 3, enrolled: 20, room: "CS-117", color: "#6c63ff" },
  { id: 18, code: "CR-018", title: "Signals and Systems", dept: "Electrical Engineering", teacher: "Teacher EE 1", credits: 3, enrolled: 20, room: "EE-118", color: "#e05c5c" },
  { id: 19, code: "CR-019", title: "Microprocessors", dept: "Mathematics", teacher: "Teacher MATH 1", credits: 3, enrolled: 20, room: "MATH-119", color: "#48c97e" },
  { id: 20, code: "CR-020", title: "Control Systems", dept: "Business Administration", teacher: "Teacher BBA 1", credits: 3, enrolled: 20, room: "BBA-120", color: "#f5a623" },
  { id: 21, code: "CR-021", title: "Principles of Management", dept: "Computer Science", teacher: "Teacher CS 1", credits: 3, enrolled: 20, room: "CS-121", color: "#6c63ff" },
  { id: 22, code: "CR-022", title: "Marketing Management", dept: "Electrical Engineering", teacher: "Teacher EE 1", credits: 3, enrolled: 20, room: "EE-122", color: "#e05c5c" },
  { id: 23, code: "CR-023", title: "Financial Accounting", dept: "Mathematics", teacher: "Teacher MATH 1", credits: 3, enrolled: 20, room: "MATH-123", color: "#48c97e" },
  { id: 24, code: "CR-024", title: "Organizational Behavior", dept: "Business Administration", teacher: "Teacher BBA 1", credits: 3, enrolled: 20, room: "BBA-124", color: "#f5a623" },
  { id: 25, code: "CR-025", title: "Human Resource Management", dept: "Computer Science", teacher: "Teacher CS 1", credits: 3, enrolled: 20, room: "CS-125", color: "#6c63ff" },
  { id: 26, code: "CR-026", title: "Discrete Mathematics", dept: "Electrical Engineering", teacher: "Teacher EE 1", credits: 3, enrolled: 20, room: "EE-126", color: "#e05c5c" },
  { id: 27, code: "CR-027", title: "Probability and Statistics", dept: "Mathematics", teacher: "Teacher MATH 1", credits: 3, enrolled: 20, room: "MATH-127", color: "#48c97e" },
  { id: 28, code: "CR-028", title: "Physics I", dept: "Business Administration", teacher: "Teacher BBA 1", credits: 3, enrolled: 20, room: "BBA-128", color: "#f5a623" },
  { id: 29, code: "CR-029", title: "Physics II", dept: "Computer Science", teacher: "Teacher CS 1", credits: 3, enrolled: 20, room: "CS-129", color: "#6c63ff" },
  { id: 30, code: "CR-030", title: "Communication Skills", dept: "Electrical Engineering", teacher: "Teacher EE 1", credits: 3, enrolled: 20, room: "EE-130", color: "#e05c5c" },
];

export const studentsByYear: Record<string, Student[]> = {
  "1st Year (2026)": [
    { id: "NUM-CS-2026-01", name: "Student CS 2026 1", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2026-02", name: "Student CS 2026 2", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2026-03", name: "Student CS 2026 3", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2026-04", name: "Student CS 2026 4", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2026-05", name: "Student CS 2026 5", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-EE-2026-01", name: "Student EE 2026 1", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2026-02", name: "Student EE 2026 2", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2026-03", name: "Student EE 2026 3", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2026-04", name: "Student EE 2026 4", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2026-05", name: "Student EE 2026 5", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-MATH-2026-01", name: "Student MATH 2026 1", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2026-02", name: "Student MATH 2026 2", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2026-03", name: "Student MATH 2026 3", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2026-04", name: "Student MATH 2026 4", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2026-05", name: "Student MATH 2026 5", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-BBA-2026-01", name: "Student BBA 2026 1", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2026-02", name: "Student BBA 2026 2", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2026-03", name: "Student BBA 2026 3", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2026-04", name: "Student BBA 2026 4", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2026-05", name: "Student BBA 2026 5", program: "BSBBA", dept: "Business Administration" },
  ],
  "2nd Year (2025)": [
    { id: "NUM-CS-2025-01", name: "Student CS 2025 1", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2025-02", name: "Student CS 2025 2", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2025-03", name: "Student CS 2025 3", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2025-04", name: "Student CS 2025 4", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2025-05", name: "Student CS 2025 5", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-EE-2025-01", name: "Student EE 2025 1", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2025-02", name: "Student EE 2025 2", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2025-03", name: "Student EE 2025 3", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2025-04", name: "Student EE 2025 4", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2025-05", name: "Student EE 2025 5", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-MATH-2025-01", name: "Student MATH 2025 1", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2025-02", name: "Student MATH 2025 2", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2025-03", name: "Student MATH 2025 3", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2025-04", name: "Student MATH 2025 4", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2025-05", name: "Student MATH 2025 5", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-BBA-2025-01", name: "Student BBA 2025 1", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2025-02", name: "Student BBA 2025 2", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2025-03", name: "Student BBA 2025 3", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2025-04", name: "Student BBA 2025 4", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2025-05", name: "Student BBA 2025 5", program: "BSBBA", dept: "Business Administration" },
  ],
  "3rd Year (2024)": [
    { id: "NUM-CS-2024-01", name: "Student CS 2024 1", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2024-02", name: "Student CS 2024 2", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2024-03", name: "Student CS 2024 3", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2024-04", name: "Student CS 2024 4", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2024-05", name: "Student CS 2024 5", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-EE-2024-01", name: "Student EE 2024 1", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2024-02", name: "Student EE 2024 2", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2024-03", name: "Student EE 2024 3", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2024-04", name: "Student EE 2024 4", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2024-05", name: "Student EE 2024 5", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-MATH-2024-01", name: "Student MATH 2024 1", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2024-02", name: "Student MATH 2024 2", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2024-03", name: "Student MATH 2024 3", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2024-04", name: "Student MATH 2024 4", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2024-05", name: "Student MATH 2024 5", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-BBA-2024-01", name: "Student BBA 2024 1", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2024-02", name: "Student BBA 2024 2", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2024-03", name: "Student BBA 2024 3", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2024-04", name: "Student BBA 2024 4", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2024-05", name: "Student BBA 2024 5", program: "BSBBA", dept: "Business Administration" },
  ],
  "4th Year (2023)": [
    { id: "NUM-CS-2023-01", name: "Student CS 2023 1", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2023-02", name: "Student CS 2023 2", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2023-03", name: "Student CS 2023 3", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2023-04", name: "Student CS 2023 4", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-CS-2023-05", name: "Student CS 2023 5", program: "BSCS", dept: "Computer Science" },
    { id: "NUM-EE-2023-01", name: "Student EE 2023 1", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2023-02", name: "Student EE 2023 2", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2023-03", name: "Student EE 2023 3", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2023-04", name: "Student EE 2023 4", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-EE-2023-05", name: "Student EE 2023 5", program: "BSEE", dept: "Electrical Engineering" },
    { id: "NUM-MATH-2023-01", name: "Student MATH 2023 1", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2023-02", name: "Student MATH 2023 2", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2023-03", name: "Student MATH 2023 3", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2023-04", name: "Student MATH 2023 4", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-MATH-2023-05", name: "Student MATH 2023 5", program: "BSMATH", dept: "Mathematics" },
    { id: "NUM-BBA-2023-01", name: "Student BBA 2023 1", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2023-02", name: "Student BBA 2023 2", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2023-03", name: "Student BBA 2023 3", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2023-04", name: "Student BBA 2023 4", program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BBA-2023-05", name: "Student BBA 2023 5", program: "BSBBA", dept: "Business Administration" },
  ],
};

export interface Student {
  id:      string;
  name:    string;
  program: string;
  dept:    string;
}

export interface CourseOffering {
  id:          string;
  courseId:    number;
  courseCode:  string;
  courseTitle: string;
  teacherId:   string;
  teacherName: string;
  year:        string;
  students:    Student[];
  createdAt:   string;
}

export const YEARS = ["1st Year (2026)", "2nd Year (2025)", "3rd Year (2024)", "4th Year (2023)"];
