-- ============================================================================
-- University Management System (UMS) — Namal University Mianwali
-- MySQL 8.0+ | InnoDB | utf8mb4 | snake_case
-- ============================================================================

DROP DATABASE IF EXISTS ums_db;
CREATE DATABASE ums_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ums_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- TABLES
-- ============================================================================

CREATE TABLE departments (
    department_id   INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    hod_id          VARCHAR(15)  NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE semesters (
    semester_id INT AUTO_INCREMENT PRIMARY KEY,
    label       VARCHAR(20)  NOT NULL UNIQUE,
    start_date  DATE         NOT NULL,
    end_date    DATE         NOT NULL,
    is_current  BOOLEAN      NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;

CREATE TABLE teachers (
    teacher_id      VARCHAR(15)  PRIMARY KEY,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
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
        REFERENCES departments(department_id) ON DELETE SET NULL
) ENGINE=InnoDB;

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
        REFERENCES departments(department_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE students (
    student_id       VARCHAR(25)  PRIMARY KEY,
    full_name        VARCHAR(100) NOT NULL,
    date_of_birth    DATE         NOT NULL,
    gender           ENUM('Male','Female','Other') NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    phone_number     VARCHAR(20)  NULL,
    address          VARCHAR(255) NULL,
    profile_picture  VARCHAR(255) NULL,
    password_hash    VARCHAR(255) NOT NULL,
    program_id       INT          NOT NULL,
    enrollment_date  DATE         NOT NULL,
    current_semester TINYINT      NOT NULL DEFAULT 1,
    batch_year       YEAR         NOT NULL,
    advisor_id       VARCHAR(15)  NULL,
    status           ENUM('Active','Graduated','Suspended') NOT NULL DEFAULT 'Active',
    created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_program  FOREIGN KEY (program_id)  REFERENCES programs(program_id)  ON DELETE RESTRICT,
    CONSTRAINT fk_student_advisor  FOREIGN KEY (advisor_id)  REFERENCES teachers(teacher_id)  ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE courses (
    course_id       INT AUTO_INCREMENT PRIMARY KEY,
    course_code     VARCHAR(20)  NOT NULL UNIQUE,
    course_title    VARCHAR(150) NOT NULL,
    description     TEXT         NULL,
    credits         TINYINT      NOT NULL,
    department_id   INT          NOT NULL,
    teacher_id      VARCHAR(15)  NULL,
    semester_id     INT          NOT NULL,
    max_enrollment  SMALLINT     NOT NULL DEFAULT 40,
    room_location   VARCHAR(50)  NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT,
    CONSTRAINT fk_course_teacher    FOREIGN KEY (teacher_id)    REFERENCES teachers(teacher_id)    ON DELETE SET NULL,
    CONSTRAINT fk_course_semester   FOREIGN KEY (semester_id)   REFERENCES semesters(semester_id)  ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE timetables (
    timetable_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id    INT NOT NULL,
    day_of_week  ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
    start_time   TIME NOT NULL,
    end_time     TIME NOT NULL,
    room_hall    VARCHAR(50) NULL,
    CONSTRAINT fk_timetable_course FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE enrollments (
    enrollment_id   INT AUTO_INCREMENT PRIMARY KEY,
    student_id      VARCHAR(25) NOT NULL,
    course_id       INT         NOT NULL,
    enrollment_date DATE        NOT NULL,
    status          ENUM('Enrolled','Dropped','Completed') NOT NULL DEFAULT 'Enrolled',
    final_grade     VARCHAR(2)   NULL,
    grade_points    DECIMAL(3,2) NULL,
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_course  FOREIGN KEY (course_id)  REFERENCES courses(course_id)  ON DELETE CASCADE,
    UNIQUE KEY uq_student_course (student_id, course_id)
) ENGINE=InnoDB;

CREATE TABLE assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id     INT          NOT NULL,
    title         VARCHAR(150) NOT NULL,
    type          ENUM('Quiz','Assignment','Exam','Project','Lab') NOT NULL,
    total_marks   DECIMAL(6,2) NOT NULL,
    weightage     DECIMAL(5,2) NOT NULL,
    due_date      DATE         NOT NULL,
    instructions  TEXT         NULL,
    CONSTRAINT fk_assessment_course FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE assessment_results (
    result_id       INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id   INT          NOT NULL,
    student_id      VARCHAR(25)  NOT NULL,
    marks_obtained  DECIMAL(6,2) NULL,
    submission_date DATETIME     NULL,
    status          ENUM('Pending','Submitted','Graded','Late') NOT NULL DEFAULT 'Pending',
    feedback        TEXT         NULL,
    CONSTRAINT fk_result_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    CONSTRAINT fk_result_student    FOREIGN KEY (student_id)    REFERENCES students(student_id)    ON DELETE CASCADE,
    UNIQUE KEY uq_assessment_student (assessment_id, student_id)
) ENGINE=InnoDB;

CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id    VARCHAR(25) NOT NULL,
    course_id     INT         NOT NULL,
    class_date    DATE        NOT NULL,
    status        ENUM('Present','Absent','Late','Excused') NOT NULL,
    marked_by     VARCHAR(15) NULL,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_course  FOREIGN KEY (course_id)  REFERENCES courses(course_id)  ON DELETE CASCADE,
    CONSTRAINT fk_attendance_marker  FOREIGN KEY (marked_by)  REFERENCES teachers(teacher_id) ON DELETE SET NULL,
    UNIQUE KEY uq_attendance_once (student_id, course_id, class_date)
) ENGINE=InnoDB;

CREATE TABLE transcripts (
    transcript_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id    VARCHAR(25) NOT NULL,
    semester_id   INT         NOT NULL,
    semester_gpa  DECIMAL(3,2) NOT NULL,
    cgpa          DECIMAL(3,2) NOT NULL,
    total_credits SMALLINT    NOT NULL,
    CONSTRAINT fk_transcript_student  FOREIGN KEY (student_id)  REFERENCES students(student_id)  ON DELETE CASCADE,
    CONSTRAINT fk_transcript_semester FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE RESTRICT,
    UNIQUE KEY uq_transcript_student_semester (student_id, semester_id)
) ENGINE=InnoDB;

CREATE TABLE messages (
    message_id    INT AUTO_INCREMENT PRIMARY KEY,
    sender_id     VARCHAR(25) NOT NULL,
    sender_type   ENUM('student','teacher') NOT NULL,
    receiver_id   VARCHAR(25) NOT NULL,
    receiver_type ENUM('student','teacher') NOT NULL,
    subject       VARCHAR(200) NULL,
    body          TEXT NOT NULL,
    sent_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read       BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id         VARCHAR(25) NOT NULL,
    user_type       ENUM('student','teacher') NOT NULL,
    title           VARCHAR(200) NOT NULL,
    body            TEXT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE fees (
    fee_id             INT AUTO_INCREMENT PRIMARY KEY,
    student_id         VARCHAR(25) NOT NULL,
    semester_id        INT NOT NULL,
    total_fee_amount   DECIMAL(10,2) NOT NULL,
    amount_paid        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    balance_due        DECIMAL(10,2) GENERATED ALWAYS AS (total_fee_amount - amount_paid - scholarship_amount) STORED,
    payment_date       DATE NULL,
    status             ENUM('Paid','Partial','Unpaid') NOT NULL DEFAULT 'Unpaid',
    scholarship_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    scholarship_name   VARCHAR(100) NULL,
    CONSTRAINT fk_fee_student   FOREIGN KEY (student_id)  REFERENCES students(student_id)  ON DELETE CASCADE,
    CONSTRAINT fk_fee_semester  FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE RESTRICT,
    UNIQUE KEY uq_fee_student_semester (student_id, semester_id)
) ENGINE=InnoDB;

CREATE TABLE achievements (
    achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id     VARCHAR(25) NOT NULL,
    title          VARCHAR(150) NOT NULL,
    description    TEXT NULL,
    icon           VARCHAR(20)  NULL,
    date_awarded   DATE NOT NULL,
    CONSTRAINT fk_achievement_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id   INT NOT NULL,
    teacher_id  VARCHAR(15) NOT NULL,
    title       VARCHAR(150) NOT NULL,
    file_path   VARCHAR(255) NOT NULL,
    file_type   ENUM('PDF','Video','Slide','Link') NOT NULL,
    file_size   INT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT NULL,
    CONSTRAINT fk_resource_course   FOREIGN KEY (course_id)  REFERENCES courses(course_id)  ON DELETE CASCADE,
    CONSTRAINT fk_resource_teacher  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id       INT NOT NULL,
    teacher_id      VARCHAR(15) NOT NULL,
    title           VARCHAR(150) NOT NULL,
    body            TEXT NOT NULL,
    posted_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_pinned       BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_announcement_course   FOREIGN KEY (course_id)  REFERENCES courses(course_id)  ON DELETE CASCADE,
    CONSTRAINT fk_announcement_teacher  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SEED DATA — Namal University Mianwali (Demo)
-- ============================================================================

-- Departments
INSERT INTO departments (department_id, department_name) VALUES (1, 'Computer Science');
INSERT INTO departments (department_id, department_name) VALUES (2, 'Electrical Engineering');
INSERT INTO departments (department_id, department_name) VALUES (3, 'Mathematics');
INSERT INTO departments (department_id, department_name) VALUES (4, 'Business Administration');

-- Teachers (20)
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-CS-01', 'Teacher CS 1', 'teacher.cs.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-CS-02', 'Teacher CS 2', 'teacher.cs.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-CS-03', 'Teacher CS 3', 'teacher.cs.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-CS-04', 'Teacher CS 4', 'teacher.cs.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-CS-05', 'Teacher CS 5', 'teacher.cs.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-EE-01', 'Teacher EE 1', 'teacher.ee.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-EE-02', 'Teacher EE 2', 'teacher.ee.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-EE-03', 'Teacher EE 3', 'teacher.ee.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-EE-04', 'Teacher EE 4', 'teacher.ee.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-EE-05', 'Teacher EE 5', 'teacher.ee.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-MATH-01', 'Teacher MATH 1', 'teacher.math.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-MATH-02', 'Teacher MATH 2', 'teacher.math.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-MATH-03', 'Teacher MATH 3', 'teacher.math.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-MATH-04', 'Teacher MATH 4', 'teacher.math.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-MATH-05', 'Teacher MATH 5', 'teacher.math.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-BBA-01', 'Teacher BBA 1', 'teacher.bba.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-BBA-02', 'Teacher BBA 2', 'teacher.bba.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-BBA-03', 'Teacher BBA 3', 'teacher.bba.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-BBA-04', 'Teacher BBA 4', 'teacher.bba.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, 'Dr.', '2020-01-01');
INSERT INTO teachers (teacher_id, full_name, email, password_hash, department_id, designation, date_joined) VALUES ('TCH-BBA-05', 'Teacher BBA 5', 'teacher.bba.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, 'Dr.', '2020-01-01');

-- HODs
UPDATE departments SET hod_id='TCH-CS-01' WHERE department_id=1;
UPDATE departments SET hod_id='TCH-EE-01' WHERE department_id=2;
UPDATE departments SET hod_id='TCH-MATH-01' WHERE department_id=3;
UPDATE departments SET hod_id='TCH-BBA-01' WHERE department_id=4;

-- Programs
INSERT INTO programs (program_id, program_name, department_id, duration_years, total_credits) VALUES
(1,'BS Computer Science', 1, 4, 130),
(2,'BS Electrical Engineering', 2, 4, 132),
(3,'BS Mathematics', 3, 4, 120),
(4,'BS Business Administration', 4, 4, 124);

-- Semesters
INSERT INTO semesters (semester_id, label, start_date, end_date, is_current) VALUES
(1,'Fall 2026', '2026-09-01', '2026-12-31', TRUE),
(2,'Spring 2026', '2026-02-01', '2026-06-30', FALSE);

-- Students (80)
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2023-01', 'Student CS 2023 1', '2005-01-01', 'Male', 'student.cs.2023.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2023-09-01', 7, 2023, 'TCH-CS-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2023-02', 'Student CS 2023 2', '2005-01-01', 'Male', 'student.cs.2023.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2023-09-01', 7, 2023, 'TCH-CS-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2023-03', 'Student CS 2023 3', '2005-01-01', 'Male', 'student.cs.2023.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2023-09-01', 7, 2023, 'TCH-CS-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2023-04', 'Student CS 2023 4', '2005-01-01', 'Male', 'student.cs.2023.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2023-09-01', 7, 2023, 'TCH-CS-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2023-05', 'Student CS 2023 5', '2005-01-01', 'Male', 'student.cs.2023.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2023-09-01', 7, 2023, 'TCH-CS-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2024-01', 'Student CS 2024 1', '2005-01-01', 'Male', 'student.cs.2024.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2024-09-01', 5, 2024, 'TCH-CS-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2024-02', 'Student CS 2024 2', '2005-01-01', 'Male', 'student.cs.2024.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2024-09-01', 5, 2024, 'TCH-CS-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2024-03', 'Student CS 2024 3', '2005-01-01', 'Male', 'student.cs.2024.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2024-09-01', 5, 2024, 'TCH-CS-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2024-04', 'Student CS 2024 4', '2005-01-01', 'Male', 'student.cs.2024.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2024-09-01', 5, 2024, 'TCH-CS-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2024-05', 'Student CS 2024 5', '2005-01-01', 'Male', 'student.cs.2024.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2024-09-01', 5, 2024, 'TCH-CS-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2025-01', 'Student CS 2025 1', '2005-01-01', 'Male', 'student.cs.2025.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2025-09-01', 3, 2025, 'TCH-CS-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2025-02', 'Student CS 2025 2', '2005-01-01', 'Male', 'student.cs.2025.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2025-09-01', 3, 2025, 'TCH-CS-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2025-03', 'Student CS 2025 3', '2005-01-01', 'Male', 'student.cs.2025.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2025-09-01', 3, 2025, 'TCH-CS-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2025-04', 'Student CS 2025 4', '2005-01-01', 'Male', 'student.cs.2025.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2025-09-01', 3, 2025, 'TCH-CS-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2025-05', 'Student CS 2025 5', '2005-01-01', 'Male', 'student.cs.2025.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2025-09-01', 3, 2025, 'TCH-CS-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2026-01', 'Student CS 2026 1', '2005-01-01', 'Male', 'student.cs.2026.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2026-09-01', 1, 2026, 'TCH-CS-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2026-02', 'Student CS 2026 2', '2005-01-01', 'Male', 'student.cs.2026.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2026-09-01', 1, 2026, 'TCH-CS-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2026-03', 'Student CS 2026 3', '2005-01-01', 'Male', 'student.cs.2026.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2026-09-01', 1, 2026, 'TCH-CS-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2026-04', 'Student CS 2026 4', '2005-01-01', 'Male', 'student.cs.2026.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2026-09-01', 1, 2026, 'TCH-CS-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-CS-2026-05', 'Student CS 2026 5', '2005-01-01', 'Male', 'student.cs.2026.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 1, '2026-09-01', 1, 2026, 'TCH-CS-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2023-01', 'Student EE 2023 1', '2005-01-01', 'Male', 'student.ee.2023.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2023-09-01', 7, 2023, 'TCH-EE-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2023-02', 'Student EE 2023 2', '2005-01-01', 'Male', 'student.ee.2023.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2023-09-01', 7, 2023, 'TCH-EE-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2023-03', 'Student EE 2023 3', '2005-01-01', 'Male', 'student.ee.2023.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2023-09-01', 7, 2023, 'TCH-EE-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2023-04', 'Student EE 2023 4', '2005-01-01', 'Male', 'student.ee.2023.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2023-09-01', 7, 2023, 'TCH-EE-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2023-05', 'Student EE 2023 5', '2005-01-01', 'Male', 'student.ee.2023.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2023-09-01', 7, 2023, 'TCH-EE-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2024-01', 'Student EE 2024 1', '2005-01-01', 'Male', 'student.ee.2024.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2024-09-01', 5, 2024, 'TCH-EE-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2024-02', 'Student EE 2024 2', '2005-01-01', 'Male', 'student.ee.2024.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2024-09-01', 5, 2024, 'TCH-EE-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2024-03', 'Student EE 2024 3', '2005-01-01', 'Male', 'student.ee.2024.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2024-09-01', 5, 2024, 'TCH-EE-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2024-04', 'Student EE 2024 4', '2005-01-01', 'Male', 'student.ee.2024.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2024-09-01', 5, 2024, 'TCH-EE-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2024-05', 'Student EE 2024 5', '2005-01-01', 'Male', 'student.ee.2024.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2024-09-01', 5, 2024, 'TCH-EE-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2025-01', 'Student EE 2025 1', '2005-01-01', 'Male', 'student.ee.2025.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2025-09-01', 3, 2025, 'TCH-EE-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2025-02', 'Student EE 2025 2', '2005-01-01', 'Male', 'student.ee.2025.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2025-09-01', 3, 2025, 'TCH-EE-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2025-03', 'Student EE 2025 3', '2005-01-01', 'Male', 'student.ee.2025.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2025-09-01', 3, 2025, 'TCH-EE-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2025-04', 'Student EE 2025 4', '2005-01-01', 'Male', 'student.ee.2025.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2025-09-01', 3, 2025, 'TCH-EE-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2025-05', 'Student EE 2025 5', '2005-01-01', 'Male', 'student.ee.2025.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2025-09-01', 3, 2025, 'TCH-EE-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2026-01', 'Student EE 2026 1', '2005-01-01', 'Male', 'student.ee.2026.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2026-09-01', 1, 2026, 'TCH-EE-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2026-02', 'Student EE 2026 2', '2005-01-01', 'Male', 'student.ee.2026.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2026-09-01', 1, 2026, 'TCH-EE-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2026-03', 'Student EE 2026 3', '2005-01-01', 'Male', 'student.ee.2026.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2026-09-01', 1, 2026, 'TCH-EE-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2026-04', 'Student EE 2026 4', '2005-01-01', 'Male', 'student.ee.2026.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2026-09-01', 1, 2026, 'TCH-EE-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-EE-2026-05', 'Student EE 2026 5', '2005-01-01', 'Male', 'student.ee.2026.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 2, '2026-09-01', 1, 2026, 'TCH-EE-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2023-01', 'Student MATH 2023 1', '2005-01-01', 'Male', 'student.math.2023.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2023-09-01', 7, 2023, 'TCH-MATH-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2023-02', 'Student MATH 2023 2', '2005-01-01', 'Male', 'student.math.2023.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2023-09-01', 7, 2023, 'TCH-MATH-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2023-03', 'Student MATH 2023 3', '2005-01-01', 'Male', 'student.math.2023.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2023-09-01', 7, 2023, 'TCH-MATH-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2023-04', 'Student MATH 2023 4', '2005-01-01', 'Male', 'student.math.2023.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2023-09-01', 7, 2023, 'TCH-MATH-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2023-05', 'Student MATH 2023 5', '2005-01-01', 'Male', 'student.math.2023.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2023-09-01', 7, 2023, 'TCH-MATH-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2024-01', 'Student MATH 2024 1', '2005-01-01', 'Male', 'student.math.2024.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2024-09-01', 5, 2024, 'TCH-MATH-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2024-02', 'Student MATH 2024 2', '2005-01-01', 'Male', 'student.math.2024.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2024-09-01', 5, 2024, 'TCH-MATH-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2024-03', 'Student MATH 2024 3', '2005-01-01', 'Male', 'student.math.2024.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2024-09-01', 5, 2024, 'TCH-MATH-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2024-04', 'Student MATH 2024 4', '2005-01-01', 'Male', 'student.math.2024.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2024-09-01', 5, 2024, 'TCH-MATH-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2024-05', 'Student MATH 2024 5', '2005-01-01', 'Male', 'student.math.2024.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2024-09-01', 5, 2024, 'TCH-MATH-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2025-01', 'Student MATH 2025 1', '2005-01-01', 'Male', 'student.math.2025.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2025-09-01', 3, 2025, 'TCH-MATH-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2025-02', 'Student MATH 2025 2', '2005-01-01', 'Male', 'student.math.2025.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2025-09-01', 3, 2025, 'TCH-MATH-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2025-03', 'Student MATH 2025 3', '2005-01-01', 'Male', 'student.math.2025.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2025-09-01', 3, 2025, 'TCH-MATH-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2025-04', 'Student MATH 2025 4', '2005-01-01', 'Male', 'student.math.2025.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2025-09-01', 3, 2025, 'TCH-MATH-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2025-05', 'Student MATH 2025 5', '2005-01-01', 'Male', 'student.math.2025.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2025-09-01', 3, 2025, 'TCH-MATH-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2026-01', 'Student MATH 2026 1', '2005-01-01', 'Male', 'student.math.2026.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2026-09-01', 1, 2026, 'TCH-MATH-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2026-02', 'Student MATH 2026 2', '2005-01-01', 'Male', 'student.math.2026.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2026-09-01', 1, 2026, 'TCH-MATH-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2026-03', 'Student MATH 2026 3', '2005-01-01', 'Male', 'student.math.2026.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2026-09-01', 1, 2026, 'TCH-MATH-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2026-04', 'Student MATH 2026 4', '2005-01-01', 'Male', 'student.math.2026.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2026-09-01', 1, 2026, 'TCH-MATH-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-MATH-2026-05', 'Student MATH 2026 5', '2005-01-01', 'Male', 'student.math.2026.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 3, '2026-09-01', 1, 2026, 'TCH-MATH-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2023-01', 'Student BBA 2023 1', '2005-01-01', 'Male', 'student.bba.2023.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2023-09-01', 7, 2023, 'TCH-BBA-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2023-02', 'Student BBA 2023 2', '2005-01-01', 'Male', 'student.bba.2023.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2023-09-01', 7, 2023, 'TCH-BBA-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2023-03', 'Student BBA 2023 3', '2005-01-01', 'Male', 'student.bba.2023.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2023-09-01', 7, 2023, 'TCH-BBA-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2023-04', 'Student BBA 2023 4', '2005-01-01', 'Male', 'student.bba.2023.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2023-09-01', 7, 2023, 'TCH-BBA-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2023-05', 'Student BBA 2023 5', '2005-01-01', 'Male', 'student.bba.2023.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2023-09-01', 7, 2023, 'TCH-BBA-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2024-01', 'Student BBA 2024 1', '2005-01-01', 'Male', 'student.bba.2024.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2024-09-01', 5, 2024, 'TCH-BBA-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2024-02', 'Student BBA 2024 2', '2005-01-01', 'Male', 'student.bba.2024.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2024-09-01', 5, 2024, 'TCH-BBA-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2024-03', 'Student BBA 2024 3', '2005-01-01', 'Male', 'student.bba.2024.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2024-09-01', 5, 2024, 'TCH-BBA-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2024-04', 'Student BBA 2024 4', '2005-01-01', 'Male', 'student.bba.2024.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2024-09-01', 5, 2024, 'TCH-BBA-04');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2024-05', 'Student BBA 2024 5', '2005-01-01', 'Male', 'student.bba.2024.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2024-09-01', 5, 2024, 'TCH-BBA-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2025-01', 'Student BBA 2025 1', '2005-01-01', 'Male', 'student.bba.2025.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2025-09-01', 3, 2025, 'TCH-BBA-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2025-02', 'Student BBA 2025 2', '2005-01-01', 'Male', 'student.bba.2025.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2025-09-01', 3, 2025, 'TCH-BBA-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2025-03', 'Student BBA 2025 3', '2005-01-01', 'Male', 'student.bba.2025.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2025-09-01', 3, 2025, 'TCH-BBA-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2025-04', 'Student BBA 2025 4', '2005-01-01', 'Male', 'student.bba.2025.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2025-09-01', 3, 2025, 'TCH-BBA-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2025-05', 'Student BBA 2025 5', '2005-01-01', 'Male', 'student.bba.2025.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2025-09-01', 3, 2025, 'TCH-BBA-05');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2026-01', 'Student BBA 2026 1', '2005-01-01', 'Male', 'student.bba.2026.1@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2026-09-01', 1, 2026, 'TCH-BBA-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2026-02', 'Student BBA 2026 2', '2005-01-01', 'Male', 'student.bba.2026.2@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2026-09-01', 1, 2026, 'TCH-BBA-01');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2026-03', 'Student BBA 2026 3', '2005-01-01', 'Male', 'student.bba.2026.3@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2026-09-01', 1, 2026, 'TCH-BBA-02');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2026-04', 'Student BBA 2026 4', '2005-01-01', 'Male', 'student.bba.2026.4@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2026-09-01', 1, 2026, 'TCH-BBA-03');
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, password_hash, program_id, enrollment_date, current_semester, batch_year, advisor_id) VALUES ('NUM-BBA-2026-05', 'Student BBA 2026 5', '2005-01-01', 'Male', 'student.bba.2026.5@namal.edu.pk', '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', 4, '2026-09-01', 1, 2026, 'TCH-BBA-05');

-- Courses (30)
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (1, 'CR-001', 'Calculus I', 3, 1, 'TCH-CS-05', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (2, 'CR-002', 'Calculus II', 3, 2, 'TCH-EE-01', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (3, 'CR-003', 'Calculus III', 3, 3, 'TCH-MATH-02', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (4, 'CR-004', 'Linear Algebra', 3, 4, 'TCH-BBA-04', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (5, 'CR-005', 'Differential Equations', 3, 1, 'TCH-CS-02', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (6, 'CR-006', 'Programming Fundamentals', 3, 2, 'TCH-EE-05', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (7, 'CR-007', 'Object Oriented Programming', 3, 3, 'TCH-MATH-03', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (8, 'CR-008', 'Data Structures', 3, 4, 'TCH-BBA-03', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (9, 'CR-009', 'Algorithms', 3, 1, 'TCH-CS-05', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (10, 'CR-010', 'Operating Systems', 3, 2, 'TCH-EE-05', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (11, 'CR-011', 'Database Systems', 3, 3, 'TCH-MATH-01', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (12, 'CR-012', 'Software Engineering', 3, 4, 'TCH-BBA-01', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (13, 'CR-013', 'Computer Networks', 3, 1, 'TCH-CS-03', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (14, 'CR-014', 'Artificial Intelligence', 3, 2, 'TCH-EE-05', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (15, 'CR-015', 'Machine Learning', 3, 3, 'TCH-MATH-02', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (16, 'CR-016', 'Electric Circuits', 3, 4, 'TCH-BBA-02', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (17, 'CR-017', 'Digital Logic Design', 3, 1, 'TCH-CS-01', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (18, 'CR-018', 'Signals and Systems', 3, 2, 'TCH-EE-05', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (19, 'CR-019', 'Microprocessors', 3, 3, 'TCH-MATH-04', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (20, 'CR-020', 'Control Systems', 3, 4, 'TCH-BBA-04', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (21, 'CR-021', 'Principles of Management', 3, 1, 'TCH-CS-04', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (22, 'CR-022', 'Marketing Management', 3, 2, 'TCH-EE-05', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (23, 'CR-023', 'Financial Accounting', 3, 3, 'TCH-MATH-01', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (24, 'CR-024', 'Organizational Behavior', 3, 4, 'TCH-BBA-03', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (25, 'CR-025', 'Human Resource Management', 3, 1, 'TCH-CS-03', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (26, 'CR-026', 'Discrete Mathematics', 3, 2, 'TCH-EE-05', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (27, 'CR-027', 'Probability and Statistics', 3, 3, 'TCH-MATH-01', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (28, 'CR-028', 'Physics I', 3, 4, 'TCH-BBA-05', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (29, 'CR-029', 'Physics II', 3, 1, 'TCH-CS-01', 1);
INSERT INTO courses (course_id, course_code, course_title, credits, department_id, teacher_id, semester_id) VALUES (30, 'CR-030', 'Communication Skills', 3, 2, 'TCH-EE-02', 1);
