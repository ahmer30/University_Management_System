// ─── Admin Portal Data — mirrors ums_db.sql ───────────────────────────────────

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
  { id: 1, name: "Computer Science",        hod: "Dr. Ahmed Raza",    code: "CS",  color: "#6c63ff", students: 5, courses: 2 },
  { id: 2, name: "Electrical Engineering",  hod: "Dr. Tariq Mehmood", code: "EE",  color: "#e05c5c", students: 5, courses: 2 },
  { id: 3, name: "Mathematics",             hod: "Dr. Usman Khan",    code: "MATH",color: "#48c97e", students: 5, courses: 2 },
  { id: 4, name: "Business Administration", hod: "Dr. Nadia Qureshi", code: "BBA", color: "#f5a623", students: 5, courses: 2 },
];

export const teachers = [
  { id: "TCH-001", name: "Dr. Ahmed Raza",      email: "ahmed.raza@namal.edu.pk",      designation: "Dr.",                 dept: "Computer Science",        office: "CS Block, Room 101",   status: "Active" },
  { id: "TCH-002", name: "Engr. Sara Malik",    email: "sara.malik@namal.edu.pk",      designation: "Assistant Professor", dept: "Electrical Engineering",  office: "EE Block, Room 202",   status: "Active" },
  { id: "TCH-003", name: "Dr. Usman Khan",      email: "usman.khan@namal.edu.pk",      designation: "Dr.",                 dept: "Mathematics",             office: "Math Block, Room 303", status: "Active" },
  { id: "TCH-004", name: "Ms. Fatima Zia",      email: "fatima.zia@namal.edu.pk",      designation: "Lecturer",            dept: "Business Administration", office: "BBA Block, Room 404",  status: "Active" },
  { id: "TCH-005", name: "Dr. Bilal Chaudhry",  email: "bilal.chaudhry@namal.edu.pk",  designation: "Associate Professor", dept: "Computer Science",        office: "CS Block, Room 105",   status: "Active" },
  { id: "TCH-006", name: "Ms. Hina Baig",       email: "hina.baig@namal.edu.pk",       designation: "Lecturer",            dept: "Computer Science",        office: "CS Block, Room 106",   status: "Active" },
  { id: "TCH-007", name: "Dr. Tariq Mehmood",   email: "tariq.mehmood@namal.edu.pk",   designation: "Dr.",                 dept: "Electrical Engineering",  office: "EE Block, Room 207",   status: "Active" },
  { id: "TCH-008", name: "Dr. Nadia Qureshi",   email: "nadia.qureshi@namal.edu.pk",   designation: "Dr.",                 dept: "Business Administration", office: "BBA Block, Room 408",  status: "Active" },
];

export const courses = [
  { id: 1, code: "CS-201",   title: "Programming Fundamentals",   dept: "Computer Science",        teacher: "Ms. Hina Baig",       credits: 3, enrolled: 5, room: "CS-101",   color: "#6c63ff" },
  { id: 2, code: "CS-301",   title: "Data Structures & Algorithms",dept: "Computer Science",        teacher: "Dr. Ahmed Raza",      credits: 3, enrolled: 5, room: "CS-102",   color: "#6c63ff" },
  { id: 3, code: "EE-201",   title: "Circuit Analysis",           dept: "Electrical Engineering",  teacher: "Engr. Sara Malik",    credits: 3, enrolled: 5, room: "EE-101",   color: "#e05c5c" },
  { id: 4, code: "EE-301",   title: "Digital Logic Design",       dept: "Electrical Engineering",  teacher: "Dr. Tariq Mehmood",   credits: 3, enrolled: 5, room: "EE-102",   color: "#e05c5c" },
  { id: 5, code: "MATH-201", title: "Calculus I",                 dept: "Mathematics",             teacher: "Dr. Usman Khan",      credits: 3, enrolled: 5, room: "MATH-101", color: "#48c97e" },
  { id: 6, code: "MATH-301", title: "Linear Algebra",             dept: "Mathematics",             teacher: "Dr. Usman Khan",      credits: 3, enrolled: 5, room: "MATH-102", color: "#48c97e" },
  { id: 7, code: "BBA-201",  title: "Principles of Management",   dept: "Business Administration", teacher: "Ms. Fatima Zia",      credits: 3, enrolled: 5, room: "BBA-101",  color: "#f5a623" },
  { id: 8, code: "BBA-301",  title: "Financial Accounting",       dept: "Business Administration", teacher: "Dr. Nadia Qureshi",   credits: 3, enrolled: 5, room: "BBA-102",  color: "#f5a623" },
];

// Students grouped by year (all batch 2024 = 1st year for demo)
export const studentsByYear: Record<string, Student[]> = {
  "1st Year (2024)": [
    { id: "NUM-BSCS-2024-01",  name: "Hamza Ali Qureshi",    program: "BSCS",  dept: "Computer Science" },
    { id: "NUM-BSCS-2024-02",  name: "Ayesha Tariq",         program: "BSCS",  dept: "Computer Science" },
    { id: "NUM-BSCS-2024-03",  name: "Umar Farooq Siddiqui", program: "BSCS",  dept: "Computer Science" },
    { id: "NUM-BSCS-2024-04",  name: "Zainab Noor Hussain",  program: "BSCS",  dept: "Computer Science" },
    { id: "NUM-BSCS-2024-05",  name: "Bilal Ahmed Khan",     program: "BSCS",  dept: "Computer Science" },
    { id: "NUM-BSEE-2024-01",  name: "Ali Hassan Mirza",     program: "BSEE",  dept: "Electrical Engineering" },
    { id: "NUM-BSEE-2024-02",  name: "Nimra Shakeel",        program: "BSEE",  dept: "Electrical Engineering" },
    { id: "NUM-BSEE-2024-03",  name: "Shahzaib Anwar",       program: "BSEE",  dept: "Electrical Engineering" },
    { id: "NUM-BSEE-2024-04",  name: "Maham Farhan",         program: "BSEE",  dept: "Electrical Engineering" },
    { id: "NUM-BSEE-2024-05",  name: "Omer Sajjad",          program: "BSEE",  dept: "Electrical Engineering" },
    { id: "NUM-BSM-2024-01",   name: "Fatima Zahoor",        program: "BSM",   dept: "Mathematics" },
    { id: "NUM-BSM-2024-02",   name: "Saad Rehman",          program: "BSM",   dept: "Mathematics" },
    { id: "NUM-BSM-2024-03",   name: "Maryam Khalid",        program: "BSM",   dept: "Mathematics" },
    { id: "NUM-BSM-2024-04",   name: "Hassan Mehmood",       program: "BSM",   dept: "Mathematics" },
    { id: "NUM-BSM-2024-05",   name: "Sana Iqbal",           program: "BSM",   dept: "Mathematics" },
    { id: "NUM-BSBBA-2024-01", name: "Hira Awan",            program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BSBBA-2024-02", name: "Kamran Bashir",        program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BSBBA-2024-03", name: "Rabia Naz",            program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BSBBA-2024-04", name: "Imran Zafar",          program: "BSBBA", dept: "Business Administration" },
    { id: "NUM-BSBBA-2024-05", name: "Sadia Parveen",        program: "BSBBA", dept: "Business Administration" },
  ],
  "2nd Year (2023)": [],
  "3rd Year (2022)": [],
  "4th Year (2021)": [],
};

export interface Student {
  id:      string;
  name:    string;
  program: string;
  dept:    string;
}

// ─── Course Offering type (created by admin) ─────────────────────────────────
export interface CourseOffering {
  id:          string;   // unique id
  courseId:    number;
  courseCode:  string;
  courseTitle: string;
  teacherId:   string;
  teacherName: string;
  year:        string;   // "1st Year (2024)" etc.
  students:    Student[];
  createdAt:   string;
}

export const YEARS = ["1st Year (2024)", "2nd Year (2023)", "3rd Year (2022)", "4th Year (2021)"];
