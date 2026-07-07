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
--
-- STUDENT LOGIN  →  Roll Number + Password
-- TEACHER LOGIN  →  @namal.edu.pk email + Password
--
-- Roll Number Format:
--   BSCS  → NUM-BSCS-2024-01  to  NUM-BSCS-2024-05   password: Namal@CS01 … CS05
--   BSM   → NUM-BSM-2024-01   to  NUM-BSM-2024-05    password: Namal@M01  … M05
--   BSEE  → NUM-BSEE-2024-01  to  NUM-BSEE-2024-05   password: Namal@EE01 … EE05
--   BSBBA → NUM-BSBBA-2024-01 to  NUM-BSBBA-2024-05  password: Namal@BBA01 … BBA05
--
-- Teacher emails/passwords:
--   ahmed.raza@namal.edu.pk       Ahmed@Namal123
--   sara.malik@namal.edu.pk       Sara@Namal123
--   usman.khan@namal.edu.pk       Usman@Namal123
--   fatima.zia@namal.edu.pk       Fatima@Namal123
--   bilal.chaudhry@namal.edu.pk   Bilal@Namal123
--   hina.baig@namal.edu.pk        Hina@Namal123
--   tariq.mehmood@namal.edu.pk    Tariq@Namal123
--   nadia.qureshi@namal.edu.pk    Nadia@Namal123
-- ============================================================================

-- Departments
INSERT INTO departments (department_id, department_name) VALUES
(1, 'Computer Science'),
(2, 'Electrical Engineering'),
(3, 'Mathematics'),
(4, 'Business Administration');

-- Teachers
INSERT INTO teachers (teacher_id, full_name, email, password_hash, phone_number, department_id, designation, office_location, office_hours, date_joined, status) VALUES
('TCH-001','Dr. Ahmed Raza',       'ahmed.raza@namal.edu.pk',      '$2b$12$Gls8ALqJO67sHN3Sxw5eJO/CeWeAd0Lxgv6z4/36cDGnqSpIdc7Ri', '+92-300-1234567',1,'Dr.',                 'CS Block, Room 101','Mon/Wed 10-12 AM','2015-08-01','Active'),
('TCH-002','Engr. Sara Malik',     'sara.malik@namal.edu.pk',      '$2b$12$8juwU9aijAK8sa43QNedueFvaf.L00VzZG81PBApEm7Pm8jijY2Xu', '+92-301-2345678',2,'Assistant Professor', 'EE Block, Room 202','Tue/Thu 2-4 PM',  '2017-01-15','Active'),
('TCH-003','Dr. Usman Khan',       'usman.khan@namal.edu.pk',      '$2b$12$qw6r/EA07hK.//LN9JQGPe4BEUGzwT1Y6dV5TajkNa75RuSbpjfRW', '+92-302-3456789',3,'Dr.',                 'Math Block, Room 303','Tue/Thu 11-1 PM','2012-09-01','Active'),
('TCH-004','Ms. Fatima Zia',       'fatima.zia@namal.edu.pk',      '$2b$12$G5espPe6PrSrMSQK7sbHZu0kblxL7Pz8zvxx.K3mMUe1BUuXQGbVO', '+92-303-4567890',4,'Lecturer',            'BBA Block, Room 404','Mon/Fri 9-11 AM', '2018-03-10','Active'),
('TCH-005','Dr. Bilal Chaudhry',   'bilal.chaudhry@namal.edu.pk',  '$2b$12$wucRZ/.U6SapIIwXIazicOfNYkdL/aDhkkqUVox1oYpNDPYroAL.O', '+92-304-5678901',1,'Associate Professor', 'CS Block, Room 105','Mon/Wed/Fri 11 AM','2014-06-20','Active'),
('TCH-006','Ms. Hina Baig',        'hina.baig@namal.edu.pk',       '$2b$12$MMo7Sbm8MeCHrO3Q4vdKxeMQYXTboE4f8gB4jGJLVLk.LnRS3qqGy', '+92-305-6789012',1,'Lecturer',            'CS Block, Room 106','Tue/Thu 9-11 AM', '2016-02-01','Active'),
('TCH-007','Dr. Tariq Mehmood',    'tariq.mehmood@namal.edu.pk',   '$2b$12$RppDjAwjQNFUkxUNUlDgZO2AZU6AosgVITpd8mQEotBDHsYKZ1tyi', '+92-306-7890123',2,'Dr.',                 'EE Block, Room 207','Wed/Fri 2-4 PM',  '2013-07-01','Active'),
('TCH-008','Dr. Nadia Qureshi',    'nadia.qureshi@namal.edu.pk',   '$2b$12$wTffrA63FoXhpbMn.5yhQOKMeVGreKOxxpy4eZqJs8OeJV5l4dhyu', '+92-307-8901234',4,'Dr.',                 'BBA Block, Room 408','Mon/Wed 1-3 PM',  '2019-09-01','Active');

-- HODs
UPDATE departments SET hod_id='TCH-001' WHERE department_id=1;
UPDATE departments SET hod_id='TCH-007' WHERE department_id=2;
UPDATE departments SET hod_id='TCH-003' WHERE department_id=3;
UPDATE departments SET hod_id='TCH-008' WHERE department_id=4;

-- Programs
INSERT INTO programs (program_id, program_name, department_id, duration_years, total_credits) VALUES
(1,'BS Computer Science',        1,4,130),
(2,'BS Electrical Engineering',  2,4,132),
(3,'BS Mathematics',             3,4,120),
(4,'BS Business Administration', 4,4,124);

-- Semesters
INSERT INTO semesters (semester_id, label, start_date, end_date, is_current) VALUES
(1,'Fall 2026',  '2026-09-01','2026-12-31',TRUE),
(2,'Spring 2026','2026-02-01','2026-06-30',FALSE);

-- ── BSCS Students (5) ──────────────────────────────────────────────────────
INSERT INTO students (student_id,full_name,date_of_birth,gender,email,phone_number,address,password_hash,program_id,enrollment_date,current_semester,batch_year,advisor_id,status) VALUES
('NUM-BSCS-2024-01','Hamza Ali Qureshi',      '2005-03-12','Male',  'hamza.ali@namal.edu.pk',      '+92-311-1111001','House 12, Mianwali',             '$2b$12$zOemZxWRq1ZAf7JTk9Hk7ugj/TJBLFjAF0D3OCsqgNdIRh9s3i8F9i',1,'2024-09-01',2,2024,'TCH-001','Active'),
('NUM-BSCS-2024-02','Ayesha Tariq',           '2005-07-22','Female','ayesha.tariq@namal.edu.pk',   '+92-311-1111002','House 45, Dera Ismail Khan',      '$2b$12$Zhq2LluAQuC4kT1rz2jQt.aZapKk1Cbo6NKdN8o121YecMRrIRO1C',1,'2024-09-01',2,2024,'TCH-001','Active'),
('NUM-BSCS-2024-03','Umar Farooq Siddiqui',   '2005-01-05','Male',  'umar.farooq@namal.edu.pk',    '+92-311-1111003','House 78, Sargodha',              '$2b$12$sLxHvY2dwl/0.OZaiYf7gOm2sRepBkmq7co9k1myff2TJJitm6q4e',1,'2024-09-01',2,2024,'TCH-005','Active'),
('NUM-BSCS-2024-04','Zainab Noor Hussain',    '2005-11-18','Female','zainab.noor@namal.edu.pk',    '+92-311-1111004','House 23, Lahore',                '$2b$12$2FwSVXBJt8njFZ8l6SisBOZI3Hdf6BK1L2ch1/2PCIdOAgasqLLq2',1,'2024-09-01',2,2024,'TCH-005','Active'),
('NUM-BSCS-2024-05','Bilal Ahmed Khan',       '2005-05-30','Male',  'bilal.ahmed@namal.edu.pk',    '+92-311-1111005','House 56, Islamabad',             '$2b$12$ULd2Us8K1oaDlzPd6gKZsuAwWHYz97cXxv4y2r2ttu0ceDPHpTDUu',1,'2024-09-01',2,2024,'TCH-001','Active');

-- ── BSM Students (5) ───────────────────────────────────────────────────────
INSERT INTO students (student_id,full_name,date_of_birth,gender,email,phone_number,address,password_hash,program_id,enrollment_date,current_semester,batch_year,advisor_id,status) VALUES
('NUM-BSM-2024-01','Fatima Zahoor',           '2005-02-14','Female','fatima.zahoor@namal.edu.pk',  '+92-312-2221001','House 33, Rawalpindi',            '$2b$12$kTXTzvc6bgZIQ.5vJc59YO.JGrZQsaKRgYuUX0wLT4YXTSpd5gXIq',3,'2024-09-01',2,2024,'TCH-003','Active'),
('NUM-BSM-2024-02','Saad Rehman',             '2005-09-08','Male',  'saad.rehman@namal.edu.pk',    '+92-312-2221002','House 67, Faisalabad',            '$2b$12$WtB1nY6Rgbsp.26xbold2uyoTE1WjToy2wIO63ZI1tM.b5N7Exadm',3,'2024-09-01',2,2024,'TCH-003','Active'),
('NUM-BSM-2024-03','Maryam Khalid',           '2005-06-20','Female','maryam.khalid@namal.edu.pk',  '+92-312-2221003','House 89, Multan',                '$2b$12$RltI5k7rI2ML97kj6kL1nOJFrZuxa9zNZmDHh5aAPBqzIsQLJ3q0e',3,'2024-09-01',2,2024,'TCH-003','Active'),
('NUM-BSM-2024-04','Hassan Mehmood',          '2005-04-11','Male',  'hassan.mehmood@namal.edu.pk', '+92-312-2221004','House 12, Peshawar',              '$2b$12$m.4ai6GPSLRJsNoCO5z2geGdJp03oyCl086JfXQSqvMW2AxeHpSjq',3,'2024-09-01',2,2024,'TCH-003','Active'),
('NUM-BSM-2024-05','Sana Iqbal',              '2005-12-03','Female','sana.iqbal@namal.edu.pk',     '+92-312-2221005','House 44, Gujranwala',            '$2b$12$YeZ2B30CjtyaoLeSo6xUMuIwqGtfFkRP3wtThXxurd.SPZJLtZA1y',3,'2024-09-01',2,2024,'TCH-003','Active');

-- ── BSEE Students (5) ──────────────────────────────────────────────────────
INSERT INTO students (student_id,full_name,date_of_birth,gender,email,phone_number,address,password_hash,program_id,enrollment_date,current_semester,batch_year,advisor_id,status) VALUES
('NUM-BSEE-2024-01','Ali Hassan Mirza',       '2005-08-15','Male',  'ali.hassan@namal.edu.pk',     '+92-313-3331001','House 77, Jhang',                 '$2b$12$tXqoQf7CwXwhbx10rkSrUOVT3QgkeS8bQ8TqQLWm.27j2jveru.em',2,'2024-09-01',2,2024,'TCH-007','Active'),
('NUM-BSEE-2024-02','Nimra Shakeel',          '2005-03-27','Female','nimra.shakeel@namal.edu.pk',  '+92-313-3331002','House 21, Chakwal',                '$2b$12$nJYJBio64dAUO7naIx.FZ.NlmNFCHihM6HPLKYzwBcFkilt5wWpry',2,'2024-09-01',2,2024,'TCH-007','Active'),
('NUM-BSEE-2024-03','Shahzaib Anwar',         '2005-10-09','Male',  'shahzaib.anwar@namal.edu.pk', '+92-313-3331003','House 55, Khushab',                '$2b$12$OVeJdGQlJAGjsbY5nFMOIuKbSzWJqQIX0ZB.Zb5B0WL6LayqlJxye',2,'2024-09-01',2,2024,'TCH-002','Active'),
('NUM-BSEE-2024-04','Maham Farhan',           '2005-07-16','Female','maham.farhan@namal.edu.pk',   '+92-313-3331004','House 38, Bhakkar',                '$2b$12$vXVhaMeDTnAloy.BgweswelS2gTQMuJn4JiR5muUa0MfbMBawDx0W',2,'2024-09-01',2,2024,'TCH-002','Active'),
('NUM-BSEE-2024-05','Omer Sajjad',            '2005-01-22','Male',  'omer.sajjad@namal.edu.pk',    '+92-313-3331005','House 90, Mianwali',               '$2b$12$w6GLISzURLrScp0e9gTLsuZxlxs.GOPnIHVjzcHfdlvqerO0Lvj1y',2,'2024-09-01',2,2024,'TCH-007','Active');

-- ── BSBBA Students (5) ─────────────────────────────────────────────────────
INSERT INTO students (student_id,full_name,date_of_birth,gender,email,phone_number,address,password_hash,program_id,enrollment_date,current_semester,batch_year,advisor_id,status) VALUES
('NUM-BSBBA-2024-01','Hira Awan',             '2005-05-10','Female','hira.awan@namal.edu.pk',      '+92-314-4441001','House 14, Attock',                '$2b$12$AFAz5DDIkqPUjnyOhuhzt.x2VcTtDsKR66N/Fof7zjC/Ux.VqVfoa',4,'2024-09-01',2,2024,'TCH-008','Active'),
('NUM-BSBBA-2024-02','Kamran Bashir',         '2005-02-28','Male',  'kamran.bashir@namal.edu.pk',  '+92-314-4441002','House 66, Mianwali',               '$2b$12$p0tbukhSfWAzeW7jE35Lze/km0Aj1wKJIMz.1kex3b93sOrZ197wy',4,'2024-09-01',2,2024,'TCH-008','Active'),
('NUM-BSBBA-2024-03','Rabia Naz',             '2005-09-14','Female','rabia.naz@namal.edu.pk',      '+92-314-4441003','House 30, Talagang',               '$2b$12$SW89SdNGjQzjtMomPWVFW.daWyZtuUtZHeVXwN2HV8hr3rUu43X1G',4,'2024-09-01',2,2024,'TCH-004','Active'),
('NUM-BSBBA-2024-04','Imran Zafar',           '2005-11-07','Male',  'imran.zafar@namal.edu.pk',    '+92-314-4441004','House 52, Chakwal',                '$2b$12$0jLCNMPa41oHLjbd/RJ/5eOngOJZSP00jTh/22WKit/78ILOKGnPC',4,'2024-09-01',2,2024,'TCH-004','Active'),
('NUM-BSBBA-2024-05','Sadia Parveen',         '2005-06-25','Female','sadia.parveen@namal.edu.pk',  '+92-314-4441005','House 11, Lahore',                 '$2b$12$jeWLAN96s2jbT05VTGhz1.uV1JmBUvXT5nkxdXqEjYZpDpoqEoywm',4,'2024-09-01',2,2024,'TCH-008','Active');

-- Courses (2 per department = 8 total)
INSERT INTO courses (course_id,course_code,course_title,description,credits,department_id,teacher_id,semester_id,max_enrollment,room_location) VALUES
(1, 'CS-201', 'Programming Fundamentals',      'Intro to programming using C++',              3,1,'TCH-006',1,40,'CS-101'),
(2, 'CS-301', 'Data Structures & Algorithms',  'Arrays, lists, trees, graphs, sorting',       3,1,'TCH-001',1,40,'CS-102'),
(3, 'EE-201', 'Circuit Analysis',              'Kirchhoff laws, network theorems',            3,2,'TCH-002',1,35,'EE-101'),
(4, 'EE-301', 'Digital Logic Design',          'Boolean algebra, gates, flip-flops',          3,2,'TCH-007',1,35,'EE-102'),
(5, 'MATH-201','Calculus I',                   'Limits, derivatives, integrals',              3,3,'TCH-003',1,50,'MATH-101'),
(6, 'MATH-301','Linear Algebra',               'Matrices, determinants, vector spaces',       3,3,'TCH-003',1,50,'MATH-102'),
(7, 'BBA-201', 'Principles of Management',     'Planning, organizing, leading, controlling',  3,4,'TCH-004',1,45,'BBA-101'),
(8, 'BBA-301', 'Financial Accounting',         'Ledger, trial balance, financial statements', 3,4,'TCH-008',1,45,'BBA-102');

-- Timetable
INSERT INTO timetables (course_id,day_of_week,start_time,end_time,room_hall) VALUES
(1,'Monday',   '08:00:00','09:30:00','CS-101'),
(1,'Wednesday','08:00:00','09:30:00','CS-101'),
(1,'Friday',   '08:00:00','09:30:00','CS-101'),
(2,'Monday',   '10:00:00','11:30:00','CS-102'),
(2,'Wednesday','10:00:00','11:30:00','CS-102'),
(2,'Friday',   '10:00:00','11:30:00','CS-102'),
(3,'Tuesday',  '08:00:00','09:30:00','EE-101'),
(3,'Thursday', '08:00:00','09:30:00','EE-101'),
(4,'Tuesday',  '10:00:00','11:30:00','EE-102'),
(4,'Thursday', '10:00:00','11:30:00','EE-102'),
(5,'Monday',   '08:00:00','09:30:00','MATH-101'),
(5,'Wednesday','08:00:00','09:30:00','MATH-101'),
(6,'Tuesday',  '08:00:00','09:30:00','MATH-102'),
(6,'Thursday', '08:00:00','09:30:00','MATH-102'),
(7,'Monday',   '12:00:00','13:30:00','BBA-101'),
(7,'Wednesday','12:00:00','13:30:00','BBA-101'),
(8,'Tuesday',  '12:00:00','13:30:00','BBA-102'),
(8,'Thursday', '12:00:00','13:30:00','BBA-102');

-- Enrollments — each student enrolled in their dept courses
INSERT INTO enrollments (student_id,course_id,enrollment_date,status) VALUES
-- BSCS students → CS courses
('NUM-BSCS-2024-01',1,'2024-09-01','Enrolled'),
('NUM-BSCS-2024-01',2,'2024-09-01','Enrolled'),
('NUM-BSCS-2024-02',1,'2024-09-01','Enrolled'),
('NUM-BSCS-2024-02',2,'2024-09-01','Enrolled'),
('NUM-BSCS-2024-03',1,'2024-09-01','Enrolled'),
('NUM-BSCS-2024-03',2,'2024-09-01','Enrolled'),
('NUM-BSCS-2024-04',1,'2024-09-01','Enrolled'),
('NUM-BSCS-2024-04',2,'2024-09-01','Enrolled'),
('NUM-BSCS-2024-05',1,'2024-09-01','Enrolled'),
('NUM-BSCS-2024-05',2,'2024-09-01','Enrolled'),
-- BSEE students → EE courses
('NUM-BSEE-2024-01',3,'2024-09-01','Enrolled'),
('NUM-BSEE-2024-01',4,'2024-09-01','Enrolled'),
('NUM-BSEE-2024-02',3,'2024-09-01','Enrolled'),
('NUM-BSEE-2024-02',4,'2024-09-01','Enrolled'),
('NUM-BSEE-2024-03',3,'2024-09-01','Enrolled'),
('NUM-BSEE-2024-03',4,'2024-09-01','Enrolled'),
('NUM-BSEE-2024-04',3,'2024-09-01','Enrolled'),
('NUM-BSEE-2024-04',4,'2024-09-01','Enrolled'),
('NUM-BSEE-2024-05',3,'2024-09-01','Enrolled'),
('NUM-BSEE-2024-05',4,'2024-09-01','Enrolled'),
-- BSM students → Math courses
('NUM-BSM-2024-01',5,'2024-09-01','Enrolled'),
('NUM-BSM-2024-01',6,'2024-09-01','Enrolled'),
('NUM-BSM-2024-02',5,'2024-09-01','Enrolled'),
('NUM-BSM-2024-02',6,'2024-09-01','Enrolled'),
('NUM-BSM-2024-03',5,'2024-09-01','Enrolled'),
('NUM-BSM-2024-03',6,'2024-09-01','Enrolled'),
('NUM-BSM-2024-04',5,'2024-09-01','Enrolled'),
('NUM-BSM-2024-04',6,'2024-09-01','Enrolled'),
('NUM-BSM-2024-05',5,'2024-09-01','Enrolled'),
('NUM-BSM-2024-05',6,'2024-09-01','Enrolled'),
-- BSBBA students → BBA courses
('NUM-BSBBA-2024-01',7,'2024-09-01','Enrolled'),
('NUM-BSBBA-2024-01',8,'2024-09-01','Enrolled'),
('NUM-BSBBA-2024-02',7,'2024-09-01','Enrolled'),
('NUM-BSBBA-2024-02',8,'2024-09-01','Enrolled'),
('NUM-BSBBA-2024-03',7,'2024-09-01','Enrolled'),
('NUM-BSBBA-2024-03',8,'2024-09-01','Enrolled'),
('NUM-BSBBA-2024-04',7,'2024-09-01','Enrolled'),
('NUM-BSBBA-2024-04',8,'2024-09-01','Enrolled'),
('NUM-BSBBA-2024-05',7,'2024-09-01','Enrolled'),
('NUM-BSBBA-2024-05',8,'2024-09-01','Enrolled');

-- Assessments (2 per course)
INSERT INTO assessments (course_id,title,type,total_marks,weightage,due_date) VALUES
(1,'Quiz 1: Variables & Loops',    'Quiz',      20, 5, '2026-10-05'),
(1,'Assignment 1: Functions',      'Assignment',50,10, '2026-10-20'),
(2,'Quiz 1: Arrays & Pointers',    'Quiz',      20, 5, '2026-10-07'),
(2,'Midterm Exam',                 'Exam',     100,30, '2026-11-01'),
(3,'Lab 1: Circuit Measurements',  'Lab',       30,10, '2026-10-08'),
(3,'Midterm Exam',                 'Exam',     100,30, '2026-11-03'),
(4,'Quiz 1: Boolean Algebra',      'Quiz',      20, 5, '2026-10-09'),
(4,'Assignment 1: Gate Design',    'Assignment', 50,10,'2026-10-25'),
(5,'Quiz 1: Limits',               'Quiz',      20, 5, '2026-10-06'),
(5,'Midterm Exam',                 'Exam',     100,30, '2026-11-02'),
(6,'Assignment 1: Matrix Ops',     'Assignment', 50,10,'2026-10-22'),
(6,'Midterm Exam',                 'Exam',     100,30, '2026-11-04'),
(7,'Quiz 1: Management Basics',    'Quiz',      20, 5, '2026-10-05'),
(7,'Assignment 1: Case Study',     'Assignment', 50,10,'2026-10-21'),
(8,'Quiz 1: Journal Entries',      'Quiz',      20, 5, '2026-10-06'),
(8,'Midterm Exam',                 'Exam',     100,30, '2026-11-02');

-- Sample assessment results for BSCS students in CS-201 Quiz 1 (assessment_id=1)
INSERT INTO assessment_results (assessment_id,student_id,marks_obtained,submission_date,status,feedback) VALUES
(1,'NUM-BSCS-2024-01',17,'2026-10-05 10:00:00','Graded','Good understanding of loops'),
(1,'NUM-BSCS-2024-02',15,'2026-10-05 10:05:00','Graded','Review variable scoping'),
(1,'NUM-BSCS-2024-03',18,'2026-10-05 10:02:00','Graded','Excellent!'),
(1,'NUM-BSCS-2024-04',14,'2026-10-05 10:08:00','Graded','Practice more examples'),
(1,'NUM-BSCS-2024-05',19,'2026-10-05 10:01:00','Graded','Outstanding work');

-- Attendance samples
INSERT INTO attendance (student_id,course_id,class_date,status,marked_by) VALUES
('NUM-BSCS-2024-01',1,'2026-09-08','Present','TCH-006'),
('NUM-BSCS-2024-02',1,'2026-09-08','Present','TCH-006'),
('NUM-BSCS-2024-03',1,'2026-09-08','Absent', 'TCH-006'),
('NUM-BSCS-2024-04',1,'2026-09-08','Present','TCH-006'),
('NUM-BSCS-2024-05',1,'2026-09-08','Late',   'TCH-006'),
('NUM-BSEE-2024-01',3,'2026-09-09','Present','TCH-002'),
('NUM-BSEE-2024-02',3,'2026-09-09','Present','TCH-002'),
('NUM-BSM-2024-01', 5,'2026-09-08','Present','TCH-003'),
('NUM-BSM-2024-02', 5,'2026-09-08','Absent', 'TCH-003');

-- Transcripts (semester 2 results)
INSERT INTO transcripts (student_id,semester_id,semester_gpa,cgpa,total_credits) VALUES
('NUM-BSCS-2024-01',2,3.60,3.60,18),
('NUM-BSCS-2024-02',2,3.40,3.40,18),
('NUM-BSCS-2024-03',2,3.80,3.80,18),
('NUM-BSEE-2024-01',2,3.50,3.50,18),
('NUM-BSM-2024-01', 2,3.70,3.70,18),
('NUM-BSBBA-2024-01',2,3.20,3.20,18);

-- Fee records
INSERT INTO fees (student_id,semester_id,total_fee_amount,amount_paid,payment_date,status,scholarship_amount) VALUES
('NUM-BSCS-2024-01',1,45000.00,45000.00,'2024-09-03','Paid',    5000.00),
('NUM-BSCS-2024-02',1,45000.00,22500.00,'2024-09-10','Partial',    0.00),
('NUM-BSCS-2024-03',1,45000.00,45000.00,'2024-09-02','Paid',       0.00),
('NUM-BSEE-2024-01',1,48000.00,48000.00,'2024-09-01','Paid',    6000.00),
('NUM-BSM-2024-01', 1,42000.00,    0.00,NULL,         'Unpaid',    0.00),
('NUM-BSBBA-2024-01',1,46000.00,46000.00,'2024-09-05','Paid',   4000.00);

-- Announcements
INSERT INTO announcements (course_id,teacher_id,title,body,is_pinned) VALUES
(1,'TCH-006','Welcome to CS-201','Course outline has been shared. Attendance is mandatory.',TRUE),
(2,'TCH-001','Midterm Schedule','Midterm exam will be held on Nov 1 in CS-102. Syllabus: Chapters 1-5.',TRUE),
(3,'TCH-002','Lab Safety','Please read the lab safety manual before Lab 1.',TRUE),
(5,'TCH-003','Quiz 1 Notice','Quiz 1 will cover limits and continuity. No notes allowed.',FALSE),
(7,'TCH-004','Case Study Groups','Form groups of 3 for Assignment 1 case study.',FALSE);
