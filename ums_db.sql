-- ============================================================================
-- University Management System (UMS) — MySQL 8.0+ Schema
-- Engine: InnoDB | Charset: utf8mb4 | Naming: snake_case
-- ============================================================================

DROP DATABASE IF EXISTS ums_db;
CREATE DATABASE ums_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ums_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- SECTION 1: SYSTEM / LOOKUP TABLES (created first — no forward deps)
-- ============================================================================

CREATE TABLE departments (
    department_id   INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    hod_id          VARCHAR(15)  NULL,               -- FK added after teachers table exists
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE semesters (
    semester_id INT AUTO_INCREMENT PRIMARY KEY,
    label       VARCHAR(20)  NOT NULL UNIQUE,         -- e.g. 'Fall 2026'
    start_date  DATE         NOT NULL,
    end_date    DATE         NOT NULL,
    is_current  BOOLEAN      NOT NULL DEFAULT FALSE,
    CONSTRAINT chk_semester_dates CHECK (end_date > start_date)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 2: TEACHERS (must exist before departments.hod_id FK and courses)
-- ============================================================================

CREATE TABLE teachers (
    teacher_id      VARCHAR(15)  PRIMARY KEY,          -- e.g. 'TCH-001'
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,             -- bcrypt hash only
    phone_number    VARCHAR(20)  NULL,
    department_id   INT          NULL,
    designation     ENUM('Professor','Associate Professor','Assistant Professor','Lecturer','Dr.') NOT NULL,
    office_location VARCHAR(100) NULL,
    office_hours    VARCHAR(150) NULL,
    profile_picture VARCHAR(255) NULL,
    date_joined     DATE         NOT NULL,
    status          ENUM('Active','On Leave','Retired') NOT NULL DEFAULT 'Active',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_teacher_department FOREIGN KEY (department_id)
        REFERENCES departments(department_id) ON DELETE SET NULL,
    INDEX idx_teacher_department (department_id)
) ENGINE=InnoDB;

-- Deferred FK: departments.hod_id -> teachers.teacher_id
ALTER TABLE departments
    ADD CONSTRAINT fk_department_hod FOREIGN KEY (hod_id)
        REFERENCES teachers(teacher_id) ON DELETE SET NULL;

CREATE TABLE programs (
    program_id      INT AUTO_INCREMENT PRIMARY KEY,
    program_name    VARCHAR(100) NOT NULL,
    department_id   INT          NOT NULL,
    duration_years  TINYINT      NOT NULL,
    total_credits   SMALLINT     NOT NULL,
    CONSTRAINT fk_program_department FOREIGN KEY (department_id)
        REFERENCES departments(department_id) ON DELETE CASCADE,
    UNIQUE KEY uq_program_dept (program_name, department_id)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 3: STUDENTS
-- ============================================================================

CREATE TABLE students (
    student_id       VARCHAR(20)  PRIMARY KEY,          -- e.g. '2021-CS-0042'
    full_name        VARCHAR(100) NOT NULL,
    date_of_birth    DATE         NOT NULL,
    gender           ENUM('Male','Female','Other') NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    phone_number     VARCHAR(20)  NULL,
    address          VARCHAR(255) NULL,
    profile_picture  VARCHAR(255) NULL,
    password_hash    VARCHAR(255) NOT NULL,             -- bcrypt hash only
    program_id       INT          NOT NULL,
    enrollment_date  DATE         NOT NULL,
    current_semester TINYINT      NOT NULL DEFAULT 1,
    batch_year       YEAR         NOT NULL,
    advisor_id       VARCHAR(15)  NULL,
    status           ENUM('Active','Graduated','Suspended') NOT NULL DEFAULT 'Active',
    created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_program FOREIGN KEY (program_id)
        REFERENCES programs(program_id) ON DELETE RESTRICT,
    CONSTRAINT fk_student_advisor FOREIGN KEY (advisor_id)
        REFERENCES teachers(teacher_id) ON DELETE SET NULL,
    INDEX idx_student_program (program_id),
    INDEX idx_student_advisor (advisor_id),
    INDEX idx_student_status (status)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 4: COURSES & SCHEDULING
-- ============================================================================

CREATE TABLE courses (
    course_id       INT AUTO_INCREMENT PRIMARY KEY,
    course_code     VARCHAR(20)  NOT NULL UNIQUE,       -- e.g. 'CS-401'
    course_title    VARCHAR(150) NOT NULL,
    description     TEXT         NULL,
    credits         TINYINT      NOT NULL,
    department_id   INT          NOT NULL,
    teacher_id      VARCHAR(15)  NULL,
    semester_id     INT          NOT NULL,
    max_enrollment  SMALLINT     NOT NULL DEFAULT 40,
    room_location   VARCHAR(50)  NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_department FOREIGN KEY (department_id)
        REFERENCES departments(department_id) ON DELETE RESTRICT,
    CONSTRAINT fk_course_teacher FOREIGN KEY (teacher_id)
        REFERENCES teachers(teacher_id) ON DELETE SET NULL,
    CONSTRAINT fk_course_semester FOREIGN KEY (semester_id)
        REFERENCES semesters(semester_id) ON DELETE RESTRICT,
    INDEX idx_course_teacher (teacher_id),
    INDEX idx_course_semester (semester_id)
) ENGINE=InnoDB;

-- NOTE: 'Schedule/Timetable' text field from spec is normalized into
-- the dedicated timetables table below to avoid duplicated/unstructured data.

CREATE TABLE timetables (
    timetable_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id    INT NOT NULL,
    day_of_week  ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
    start_time   TIME NOT NULL,
    end_time     TIME NOT NULL,
    room_hall    VARCHAR(50) NULL,
    CONSTRAINT fk_timetable_course FOREIGN KEY (course_id)
        REFERENCES courses(course_id) ON DELETE CASCADE,
    CONSTRAINT chk_timetable_time CHECK (end_time > start_time),
    INDEX idx_timetable_course (course_id)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 5: ENROLLMENT, ASSESSMENTS, RESULTS
-- ============================================================================

CREATE TABLE enrollments (
    enrollment_id   INT AUTO_INCREMENT PRIMARY KEY,
    student_id      VARCHAR(20) NOT NULL,
    course_id       INT         NOT NULL,
    enrollment_date DATE        NOT NULL,
    status          ENUM('Enrolled','Dropped','Completed') NOT NULL DEFAULT 'Enrolled',
    final_grade     VARCHAR(2)  NULL,                  -- 'A','A-','B+', etc.
    grade_points    DECIMAL(3,2) NULL,                 -- 0.00 - 4.00
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id)
        REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id)
        REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_course (student_id, course_id),
    INDEX idx_enrollment_course (course_id)
) ENGINE=InnoDB;

CREATE TABLE assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id     INT          NOT NULL,
    title         VARCHAR(150) NOT NULL,
    type          ENUM('Quiz','Assignment','Exam','Project','Lab') NOT NULL,
    total_marks   DECIMAL(6,2) NOT NULL,
    weightage     DECIMAL(5,2) NOT NULL,                -- percent, e.g. 20.00
    due_date      DATE         NOT NULL,
    instructions  TEXT         NULL,
    CONSTRAINT fk_assessment_course FOREIGN KEY (course_id)
        REFERENCES courses(course_id) ON DELETE CASCADE,
    CONSTRAINT chk_weightage CHECK (weightage BETWEEN 0 AND 100),
    INDEX idx_assessment_course (course_id)
) ENGINE=InnoDB;

CREATE TABLE assessment_results (
    result_id        INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id    INT          NOT NULL,
    student_id       VARCHAR(20)  NOT NULL,
    marks_obtained   DECIMAL(6,2) NULL,
    submission_date  DATETIME     NULL,
    status           ENUM('Pending','Submitted','Graded','Late') NOT NULL DEFAULT 'Pending',
    feedback         TEXT         NULL,
    CONSTRAINT fk_result_assessment FOREIGN KEY (assessment_id)
        REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    CONSTRAINT fk_result_student FOREIGN KEY (student_id)
        REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY uq_assessment_student (assessment_id, student_id),
    INDEX idx_result_student (student_id)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 6: ATTENDANCE & TRANSCRIPTS
-- ============================================================================

CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id    VARCHAR(20) NOT NULL,
    course_id     INT         NOT NULL,
    class_date    DATE        NOT NULL,
    status        ENUM('Present','Absent','Late','Excused') NOT NULL,
    marked_by     VARCHAR(15) NULL,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id)
        REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_course FOREIGN KEY (course_id)
        REFERENCES courses(course_id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_marker FOREIGN KEY (marked_by)
        REFERENCES teachers(teacher_id) ON DELETE SET NULL,
    UNIQUE KEY uq_attendance_once (student_id, course_id, class_date),
    INDEX idx_attendance_course_date (course_id, class_date)
) ENGINE=InnoDB;

CREATE TABLE transcripts (
    transcript_id     INT AUTO_INCREMENT PRIMARY KEY,
    student_id        VARCHAR(20) NOT NULL,
    semester_id       INT         NOT NULL,
    semester_gpa      DECIMAL(3,2) NOT NULL,
    cgpa              DECIMAL(3,2) NOT NULL,
    total_credits     SMALLINT    NOT NULL,
    CONSTRAINT fk_transcript_student FOREIGN KEY (student_id)
        REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_transcript_semester FOREIGN KEY (semester_id)
        REFERENCES semesters(semester_id) ON DELETE RESTRICT,
    UNIQUE KEY uq_transcript_student_semester (student_id, semester_id)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 7: COMMUNICATION (polymorphic actor: student/teacher)
-- ============================================================================

CREATE TABLE messages (
    message_id    INT AUTO_INCREMENT PRIMARY KEY,
    sender_id     VARCHAR(20) NOT NULL,
    sender_type   ENUM('student','teacher') NOT NULL,
    receiver_id   VARCHAR(20) NOT NULL,
    receiver_type ENUM('student','teacher') NOT NULL,
    subject       VARCHAR(200) NULL,
    body          TEXT NOT NULL,
    sent_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read       BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_message_receiver (receiver_id, receiver_type, is_read)
    -- No FK to students/teachers directly: polymorphic actor pattern,
    -- integrity enforced at application layer via sender_type/receiver_type.
) ENGINE=InnoDB;

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id         VARCHAR(20) NOT NULL,
    user_type       ENUM('student','teacher') NOT NULL,
    title           VARCHAR(200) NOT NULL,
    body            TEXT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notification_user (user_id, user_type, is_read)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 8: FINANCIALS & ACHIEVEMENTS
-- ============================================================================

CREATE TABLE fees (
    fee_id              INT AUTO_INCREMENT PRIMARY KEY,
    student_id          VARCHAR(20) NOT NULL,
    semester_id         INT NOT NULL,
    total_fee_amount    DECIMAL(10,2) NOT NULL,
    amount_paid         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    balance_due         DECIMAL(10,2) GENERATED ALWAYS AS (total_fee_amount - amount_paid - scholarship_amount) STORED,
    payment_date        DATE NULL,
    status              ENUM('Paid','Partial','Unpaid') NOT NULL DEFAULT 'Unpaid',
    scholarship_amount  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    scholarship_name    VARCHAR(100) NULL,
    CONSTRAINT fk_fee_student FOREIGN KEY (student_id)
        REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_fee_semester FOREIGN KEY (semester_id)
        REFERENCES semesters(semester_id) ON DELETE RESTRICT,
    UNIQUE KEY uq_fee_student_semester (student_id, semester_id)
) ENGINE=InnoDB;

CREATE TABLE achievements (
    achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id     VARCHAR(20) NOT NULL,
    title          VARCHAR(150) NOT NULL,
    description    TEXT NULL,
    icon           VARCHAR(20) NULL,                    -- emoji or icon key
    date_awarded   DATE NOT NULL,
    CONSTRAINT fk_achievement_student FOREIGN KEY (student_id)
        REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 9: TEACHER CONTENT (resources & announcements)
-- ============================================================================

CREATE TABLE resources (
    resource_id  INT AUTO_INCREMENT PRIMARY KEY,
    course_id    INT NOT NULL,
    teacher_id   VARCHAR(15) NOT NULL,
    title        VARCHAR(150) NOT NULL,
    file_path    VARCHAR(255) NOT NULL,
    file_type    ENUM('PDF','Video','Slide','Link') NOT NULL,
    file_size    INT NULL,                              -- bytes
    uploaded_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description  TEXT NULL,
    CONSTRAINT fk_resource_course FOREIGN KEY (course_id)
        REFERENCES courses(course_id) ON DELETE CASCADE,
    CONSTRAINT fk_resource_teacher FOREIGN KEY (teacher_id)
        REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    INDEX idx_resource_course (course_id)
) ENGINE=InnoDB;

CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id       INT NOT NULL,
    teacher_id      VARCHAR(15) NOT NULL,
    title           VARCHAR(150) NOT NULL,
    body            TEXT NOT NULL,
    posted_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_pinned       BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_announcement_course FOREIGN KEY (course_id)
        REFERENCES courses(course_id) ON DELETE CASCADE,
    CONSTRAINT fk_announcement_teacher FOREIGN KEY (teacher_id)
        REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    INDEX idx_announcement_course (course_id, is_pinned)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SEED DATA
-- Passwords are individual bcrypt hashes (cost 12) — see credentials below:
--
--  STUDENTS  (login with student_id + password)
--    2021-CS-0042  Alex Johnson   →  Alex@2021
--    2021-CS-0011  Sara Ahmed     →  Sara@2021
--    2021-CS-0023  Bilal Khan     →  Bilal@2021
--    2022-CS-0007  Emma Wilson    →  Emma@2022
--    2022-CS-0018  Hammad Shabir  →  Hammad@2022
--    2023-MATH-0004 Liam Chen     →  Liam@2023
--    2023-MATH-0012 Fatima Noor   →  Fatima@2023
--    2021-CS-0055  Noah Davis     →  Noah@2021
--    2020-CS-0002  Olivia Brown   →  Olivia@2020
--    2022-CS-0031  Zainab Ali     →  Zainab@2022
--
--  TEACHERS  (login with email + password)
--    john.doe@ums.edu     John Doe      →  JohnDoe@123
--    emily.carter@ums.edu Emily Carter  →  Emily@123
--    maria.garcia@ums.edu Maria Garcia  →  Maria@123
--    alan.reed@ums.edu    Alan Reed     →  Alan@123
--    david.kim@ums.edu    David Kim     →  David@123
--    nina.patel@ums.edu   Nina Patel    →  Nina@123
-- ============================================================================

-- Departments (3)
INSERT INTO departments (department_id, department_name) VALUES
(1,'Computer Science'), (2,'Mathematics'), (3,'Electrical Engineering');

-- Teachers — each with their own bcrypt hash
INSERT INTO teachers (teacher_id, full_name, email, password_hash, phone_number, department_id, designation, office_location, office_hours, date_joined, status) VALUES
('TCH-001','John Doe',    'john.doe@ums.edu',    '$2b$12$5kB08IenZEaock0JpNepF.FC.wLvg8bvmtnhFBe.RUXH8iWtKVgIa','+1-555-0101',1,'Professor',        'CS Block A-101','Mon/Wed 2-4 PM',  '2015-08-01','Active'),
('TCH-002','Emily Carter','emily.carter@ums.edu','$2b$12$SPKwAA6DCuiHW2vMNDj69uJz69ILCr2DXNtqrOaIhuP6/mn7Z2P6q','+1-555-0102',2,'Dr.',               'Math Block B-204','Tue/Thu 1-3 PM','2017-01-15','Active'),
('TCH-003','Maria Garcia','maria.garcia@ums.edu','$2b$12$vBf3.ErU2SiG40/LBcmhR.asPiqG0gCLhy1RXFsdaYTMBPCMe5mf6','+1-555-0103',1,'Professor',        'CS Block A-105','Mon/Fri 10-12 PM','2012-09-01','Active'),
('TCH-004','Alan Reed',   'alan.reed@ums.edu',   '$2b$12$NQ3Q4bKSJKMLscQWEfgx6.BIbWE75qsxXfJzne37bhoiRYYP.gvku','+1-555-0104',3,'Dr.',               'EE Block C-301', 'Wed 3-5 PM',     '2018-03-10','Active'),
('TCH-005','David Kim',   'david.kim@ums.edu',   '$2b$12$l3VLwGHXi7RyiXHoUN6/V.YtHDSM1YWFevCV5tMvyBFw3LoZgJB5O','+1-555-0105',1,'Professor',        'CS Block A-110','Tue/Thu 9-11 AM','2014-06-20','Active');

INSERT INTO teachers (teacher_id, full_name, email, password_hash, phone_number, department_id, designation, office_location, office_hours, date_joined, status) VALUES
('TCH-006','Nina Patel',  'nina.patel@ums.edu',  '$2b$12$mGmiERQk2gvYmJEASFTs8OfcceHPCizpQCCkgJjX69bjiJzbNYcJi','+1-555-0106',1,'Dr.',               'CS Block A-112','Mon/Wed 11-1 PM','2016-02-01','Active');

-- Department HODs
UPDATE departments SET hod_id='TCH-001' WHERE department_id=1;
UPDATE departments SET hod_id='TCH-002' WHERE department_id=2;
UPDATE departments SET hod_id='TCH-004' WHERE department_id=3;

-- Programs (2)
INSERT INTO programs (program_id, program_name, department_id, duration_years, total_credits) VALUES
(1,'BS Computer Science',1,4,130),
(2,'BS Mathematics',2,4,120);

-- Semesters (2)
INSERT INTO semesters (semester_id, label, start_date, end_date, is_current) VALUES
(1,'Fall 2026','2026-09-01','2026-12-20',TRUE),
(2,'Spring 2026','2026-01-15','2026-05-15',FALSE);

-- Students — each with their own bcrypt hash
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, phone_number, address, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id, status) VALUES
('2021-CS-0042', 'Alex Johnson',  '2003-03-15','Male',  'alex.johnson@ums.edu', '+1-555-1001','221 Baker St',  '$2b$12$qVWpRMwOdDXsjceuXCEveeLF823avnQO4r3T22eyj/.bG5m6hfyqW',1,'2021-09-01',7,2021,'TCH-001','Active'),
('2021-CS-0011', 'Sara Ahmed',    '2003-01-22','Female','sara.ahmed@ums.edu',   '+1-555-1002','12 Elm St',     '$2b$12$SPKYi3d4PX6Ld/Hd6MbpS.vu6Kd5H9KbF317gt9pkZIAUPnQsVzU.',1,'2021-09-01',7,2021,'TCH-001','Active'),
('2021-CS-0023', 'Bilal Khan',    '2002-11-05','Male',  'bilal.khan@ums.edu',   '+1-555-1003','34 Oak Ave',    '$2b$12$rNkSrSftlYVehgbPijipaOseKWP4HC0sRDglvKdiRyfluQLSGUYHO',1,'2021-09-01',7,2021,'TCH-005','Active'),
('2022-CS-0007', 'Emma Wilson',   '2004-02-18','Female','emma.wilson@ums.edu',  '+1-555-1004','56 Pine Rd',    '$2b$12$FUSe3LAzNTx/TjjcSSgQM.jmGVMteh801TjHZ9GV6IqY5s6bNhrPe',1,'2022-09-01',5,2022,'TCH-003','Active'),
('2022-CS-0018', 'Hammad Shabir', '2004-06-30','Male',  'hammad.shabir@ums.edu','+1-555-1005','78 Maple St',   '$2b$12$OythOEUbiCVagoubN9XNcutzbUm9PYd9CS8pm7PulvZCbvR917.MG',1,'2022-09-01',5,2022,'TCH-005','Active'),
('2023-MATH-0004','Liam Chen',    '2005-03-09','Male',  'liam.chen@ums.edu',    '+1-555-1006','90 Cedar Ave',  '$2b$12$JRZ5i2uQQT7M1JG0HtjlZebwQYwFSHeFlUMvQpXpXCmttVG2w.X8q',2,'2023-09-01',3,2023,'TCH-002','Active'),
('2023-MATH-0012','Fatima Noor',  '2005-07-14','Female','fatima.noor@ums.edu',  '+1-555-1007','15 Birch Ln',   '$2b$12$UeG/34gfhsjGuTyxOAv3ueP3V7xq2dmdRYF7AAUrr/sY0IwO.cg3y',2,'2023-09-01',3,2023,'TCH-002','Active'),
('2021-CS-0055', 'Noah Davis',    '2003-09-25','Male',  'noah.davis@ums.edu',   '+1-555-1008','22 Spruce Dr',  '$2b$12$WaTT1.B3Xsf8RMgv4LDr2.dlblr/SRWcXKIDta7Qja7oh1F1l2.pa',1,'2021-09-01',7,2021,'TCH-001','Active'),
('2020-CS-0002', 'Olivia Brown',  '2002-05-03','Female','olivia.brown@ums.edu', '+1-555-1009','44 Willow Ct',  '$2b$12$AZCzj6zqc3TldZg2KDdNnOYpnOHHCskMe4NdoLhMXe3eFrYfCuSw.',1,'2020-09-01',9,2020,'TCH-003','Graduated'),
('2022-CS-0031', 'Zainab Ali',    '2004-10-11','Female','zainab.ali@ums.edu',   '+1-555-1010','5 Aspen Way',   '$2b$12$ylrrBIdf1mmFclecIuRhEe/2m6Ecmyiqr/ac0xl/63O7yNsT0sCry',1,'2022-09-01',5,2022,'TCH-005','Active');

-- Courses (6 required + none extra to respect row cap)
INSERT INTO courses (course_id, course_code, course_title, description, credits, department_id, teacher_id, semester_id, max_enrollment, room_location) VALUES
(1,'CS-401','Data Structures & Algorithms','Core DSA concepts and problem solving',3,1,'TCH-001',1,40,'A-201'),
(2,'MATH-202','Discrete Mathematics','Logic, sets, combinatorics, graph theory',3,2,'TCH-002',1,50,'B-101'),
(3,'ENG-101','Technical Writing','Professional and technical communication',2,1,'TCH-003',1,45,'A-303'),
(4,'PHY-301','Physics for Engineers','Mechanics and electromagnetism for engineers',3,3,'TCH-004',1,35,'C-105'),
(5,'CS-305','Operating Systems','Processes, memory, scheduling, file systems',3,1,'TCH-005',1,40,'A-210'),
(6,'CS-410','Computer Networks','Network protocols, architecture, security',3,1,'TCH-006',1,40,'A-215');

-- Timetable entries — multiple days per course to match frontend schedule display
INSERT INTO timetables (course_id, day_of_week, start_time, end_time, room_hall) VALUES
-- CS-401: Mon/Wed/Fri 9:00 AM
(1,'Monday',   '09:00:00','10:30:00','A-201'),
(1,'Wednesday','09:00:00','10:30:00','A-201'),
(1,'Friday',   '09:00:00','10:30:00','A-201'),
-- MATH-202: Tue/Thu 11:00 AM
(2,'Tuesday',  '11:00:00','12:30:00','B-101'),
(2,'Thursday', '11:00:00','12:30:00','B-101'),
-- ENG-101: Mon/Wed 9:00 AM
(3,'Monday',   '13:00:00','14:00:00','A-303'),
(3,'Wednesday','13:00:00','14:00:00','A-303'),
-- PHY-301: Tue/Thu 2:00 PM
(4,'Tuesday',  '14:00:00','16:00:00','C-105'),
(4,'Thursday', '14:00:00','16:00:00','C-105'),
-- CS-305: Mon/Wed/Fri 11:00 AM
(5,'Monday',   '11:00:00','12:30:00','A-210'),
(5,'Wednesday','11:00:00','12:30:00','A-210'),
(5,'Friday',   '11:00:00','12:30:00','A-210'),
-- CS-410: Fri 2:00 PM
(6,'Friday',   '14:00:00','15:30:00','A-215');

-- Enrollments (14 — covers all 10 students across the 6 courses)
INSERT INTO enrollments (student_id, course_id, enrollment_date, status, final_grade, grade_points) VALUES
('2021-CS-0042',1,'2026-09-01','Enrolled',NULL,NULL),
('2021-CS-0042',2,'2026-09-01','Enrolled',NULL,NULL),
('2021-CS-0042',3,'2026-09-01','Enrolled',NULL,NULL),
('2021-CS-0042',4,'2026-09-01','Enrolled',NULL,NULL),
('2021-CS-0042',5,'2026-09-01','Enrolled',NULL,NULL),
('2021-CS-0042',6,'2026-09-01','Enrolled',NULL,NULL),
('2021-CS-0011',1,'2026-09-01','Enrolled',NULL,NULL),
('2021-CS-0023',1,'2026-09-01','Completed','A',4.00),
('2022-CS-0007',6,'2026-09-01','Enrolled',NULL,NULL),
('2022-CS-0018',6,'2026-09-01','Enrolled',NULL,NULL),
('2023-MATH-0004',2,'2026-09-01','Enrolled',NULL,NULL),
('2023-MATH-0012',2,'2026-09-01','Enrolled',NULL,NULL),
('2021-CS-0055',5,'2026-09-01','Enrolled',NULL,NULL),
('2020-CS-0002',5,'2025-09-01','Completed','B+',3.30),
('2022-CS-0031',1,'2026-09-01','Enrolled',NULL,NULL),
('2021-CS-0042',3,'2026-09-01','Enrolled',NULL,NULL),
('2022-CS-0007',4,'2026-09-01','Enrolled',NULL,NULL),
('2021-CS-0011',3,'2026-09-01','Enrolled',NULL,NULL);

-- Assessments (12 — 2 per course)
INSERT INTO assessments (assessment_id, course_id, title, type, total_marks, weightage, due_date, instructions) VALUES
(1,1,'Midterm Exam','Exam',100,30,'2026-10-20','Covers lectures 1-8'),
(2,1,'Assignment 1','Assignment',50,10,'2026-09-25','Implement a linked list'),
(3,2,'Quiz 1','Quiz',20,5,'2026-09-15','Chapter 1-2'),
(4,2,'Midterm Exam','Exam',100,30,'2026-10-22','Sets, logic, combinatorics'),
(5,3,'Essay 1','Assignment',50,20,'2026-09-30','Write a technical report'),
(6,3,'Final Presentation','Project',100,40,'2026-12-05','Present a technical topic'),
(7,4,'Lab 1','Lab',30,10,'2026-09-18','Mechanics lab exercise'),
(8,4,'Midterm Exam','Exam',100,30,'2026-10-25','Mechanics and kinematics'),
(9,5,'Quiz 1','Quiz',20,5,'2026-09-12','Process scheduling basics'),
(10,5,'Project','Project',100,35,'2026-11-30','Build a mini scheduler'),
(11,6,'Assignment 1','Assignment',50,15,'2026-09-28','Subnetting exercise'),
(12,6,'Midterm Exam','Exam',100,30,'2026-10-23','OSI model and TCP/IP');

-- Assessment results (10)
INSERT INTO assessment_results (assessment_id, student_id, marks_obtained, submission_date, status, feedback) VALUES
(1,'2021-CS-0042',88,'2026-10-20 11:00:00','Graded','Strong understanding of trees'),
(2,'2021-CS-0042',45,'2026-09-25 09:00:00','Graded','Good implementation'),
(1,'2021-CS-0011',76,'2026-10-20 11:05:00','Graded','Review recursion'),
(1,'2021-CS-0023',95,'2026-10-20 10:50:00','Graded','Excellent work'),
(3,'2023-MATH-0004',18,'2026-09-15 08:30:00','Graded',NULL),
(3,'2023-MATH-0012',15,'2026-09-15 08:40:00','Graded',NULL),
(9,'2021-CS-0042',19,'2026-09-12 09:15:00','Graded',NULL),
(9,'2021-CS-0055',12,'2026-09-12 09:20:00','Graded','Review deadlock section'),
(11,'2022-CS-0007',NULL,NULL,'Pending',NULL),
(11,'2022-CS-0018',48,'2026-09-28 10:00:00','Graded','Well done');

-- Attendance (10)
INSERT INTO attendance (student_id, course_id, class_date, status, marked_by) VALUES
('2021-CS-0042',1,'2026-09-08','Present','TCH-001'),
('2021-CS-0042',1,'2026-09-15','Present','TCH-001'),
('2021-CS-0011',1,'2026-09-08','Absent','TCH-001'),
('2021-CS-0023',1,'2026-09-08','Present','TCH-001'),
('2022-CS-0031',1,'2026-09-08','Late','TCH-001'),
('2023-MATH-0004',2,'2026-09-09','Present','TCH-002'),
('2023-MATH-0012',2,'2026-09-09','Excused','TCH-002'),
('2021-CS-0042',5,'2026-09-10','Present','TCH-005'),
('2021-CS-0055',5,'2026-09-10','Present','TCH-005'),
('2020-CS-0002',5,'2025-09-10','Present','TCH-005');

-- Transcripts (10)
INSERT INTO transcripts (student_id, semester_id, semester_gpa, cgpa, total_credits) VALUES
('2021-CS-0042',2,3.80,3.75,90),
('2021-CS-0011',2,3.40,3.35,90),
('2021-CS-0023',2,4.00,3.90,90),
('2022-CS-0007',2,3.20,3.25,60),
('2022-CS-0018',2,3.50,3.45,60),
('2023-MATH-0004',2,3.10,3.10,30),
('2023-MATH-0012',2,3.60,3.60,30),
('2021-CS-0055',2,3.00,3.05,90),
('2020-CS-0002',2,3.90,3.85,120),
('2022-CS-0031',2,3.30,3.30,60);

-- Messages (6)
INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, subject, body, is_read) VALUES
('2021-CS-0042','student','TCH-001','teacher','Question on Assignment 1','Could you clarify the submission format?',FALSE),
('TCH-001','teacher','2021-CS-0042','student','Re: Assignment 1','Submit as a single PDF, please.',TRUE),
('2023-MATH-0004','student','TCH-002','teacher','Midterm topics','Will Chapter 5 be included?',FALSE),
('TCH-002','teacher','2023-MATH-0004','student','Re: Midterm topics','No, only Chapters 1-4.',TRUE),
('2022-CS-0018','student','TCH-005','teacher','Project extension','Requesting a 2-day extension.',FALSE),
('TCH-005','teacher','2022-CS-0018','student','Re: Project extension','Approved, new deadline is Dec 2.',FALSE);

-- Notifications (6)
INSERT INTO notifications (user_id, user_type, title, body, is_read) VALUES
('2021-CS-0042','student','Grade Posted','Your Midterm Exam grade for CS-401 is available.',FALSE),
('2021-CS-0011','student','Attendance Alert','You were marked absent in CS-401 on 2026-09-08.',FALSE),
('TCH-001','teacher','New Message','You have a new message from Alex Johnson.',TRUE),
('2022-CS-0031','student','Fee Reminder','Your Fall 2026 fee balance is due soon.',FALSE),
('2023-MATH-0012','student','Assessment Graded','Quiz 1 has been graded.',TRUE),
('TCH-005','teacher','Extension Request','Hammad Shabir requested a project extension.',TRUE);

-- Fees (10 — one per student for current semester)
INSERT INTO fees (student_id, semester_id, total_fee_amount, amount_paid, payment_date, status, scholarship_amount, scholarship_name) VALUES
('2021-CS-0042',1,5000.00,5000.00,'2026-09-05','Paid',500.00,'Merit Scholarship'),
('2021-CS-0011',1,5000.00,2500.00,'2026-09-10','Partial',0.00,NULL),
('2021-CS-0023',1,5000.00,0.00,NULL,'Unpaid',0.00,NULL),
('2022-CS-0007',1,4800.00,4800.00,'2026-09-03','Paid',0.00,NULL),
('2022-CS-0018',1,4800.00,4800.00,'2026-09-03','Paid',0.00,NULL),
('2023-MATH-0004',1,4600.00,2300.00,'2026-09-12','Partial',0.00,NULL),
('2023-MATH-0012',1,4600.00,4600.00,'2026-09-01','Paid',300.00,'Need-Based Grant'),
('2021-CS-0055',1,5000.00,0.00,NULL,'Unpaid',0.00,NULL),
('2020-CS-0002',2,5000.00,5000.00,'2025-01-20','Paid',0.00,NULL),
('2022-CS-0031',1,4800.00,1000.00,'2026-09-14','Partial',0.00,NULL);

-- Achievements (5)
INSERT INTO achievements (student_id, title, description, icon, date_awarded) VALUES
('2021-CS-0042','Dean''s List','Top academic performance in Fall 2025','🏆','2025-12-20'),
('2021-CS-0023','Perfect Attendance','No absences in Fall 2025','🎯','2025-12-20'),
('2020-CS-0002','Top 5%','Ranked in top 5% of graduating class','⭐','2026-05-15'),
('2023-MATH-0012','Dean''s List','Top academic performance in Spring 2026','🏆','2026-05-15'),
('2021-CS-0042','Perfect Attendance','No absences in Spring 2026','🎯','2026-05-15');

-- Resources (6)
INSERT INTO resources (course_id, teacher_id, title, file_path, file_type, file_size, description) VALUES
(1,'TCH-001','Lecture 1 Slides','/uploads/cs401/lec1.pdf','PDF',2048000,'Introduction to DSA'),
(2,'TCH-002','Discrete Math Notes','/uploads/math202/notes.pdf','PDF',1536000,'Set theory notes'),
(3,'TCH-003','Writing Guide','/uploads/eng101/guide.pdf','PDF',900000,'Technical writing style guide'),
(4,'TCH-004','Physics Lab Manual','/uploads/phy301/manual.pdf','PDF',3200000,'Lab safety and procedures'),
(5,'TCH-005','OS Lecture Video','/uploads/cs305/lec1.mp4','Video',52000000,'Introduction to process management'),
(6,'TCH-006','Networking Basics Link','https://ums.edu/resources/networking-101','Link',NULL,'External reading on OSI model');

-- Announcements (6)
INSERT INTO announcements (course_id, teacher_id, title, body, is_pinned) VALUES
(1,'TCH-001','Midterm Schedule','Midterm exam will be held on Oct 20 in A-201.',TRUE),
(2,'TCH-002','Quiz Reminder','Quiz 1 covers Chapters 1-2.',FALSE),
(3,'TCH-003','Essay Deadline Extended','New deadline for Essay 1 is Oct 2.',TRUE),
(4,'TCH-004','Lab Safety Briefing','Mandatory safety briefing before Lab 1.',TRUE),
(5,'TCH-005','Project Groups','Project groups have been posted on the portal.',FALSE),
(6,'TCH-006','Guest Lecture','Guest lecture on network security next Friday.',FALSE);
