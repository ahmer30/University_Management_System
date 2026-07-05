# UMS — ERD & API Reference

## Entity Relationships

| Parent | Child | Type | FK |
|---|---|---|---|
| departments | teachers | 1:N | teachers.department_id |
| departments | programs | 1:N | programs.department_id |
| departments | courses | 1:N | courses.department_id |
| teachers | departments (HOD) | 1:1 (nullable) | departments.hod_id |
| programs | students | 1:N | students.program_id |
| teachers | students (advisor) | 1:N | students.advisor_id |
| teachers | courses | 1:N | courses.teacher_id |
| semesters | courses | 1:N | courses.semester_id |
| courses | timetables | 1:N | timetables.course_id |
| students, courses | enrollments | M:N (junction) | enrollments.student_id / course_id |
| courses | assessments | 1:N | assessments.course_id |
| assessments, students | assessment_results | M:N (junction) | result table |
| students, courses | attendance | M:N (junction, dated) | attendance.student_id / course_id |
| students, semesters | transcripts | M:N (junction) | transcripts.student_id / semester_id |
| students, semesters | fees | M:N (junction) | fees.student_id / semester_id |
| students | achievements | 1:N | achievements.student_id |
| courses, teachers | resources | 1:N / 1:N | resources.course_id / teacher_id |
| courses, teachers | announcements | 1:N / 1:N | announcements.course_id / teacher_id |
| — | messages | polymorphic (student\|teacher) | app-layer enforced |
| — | notifications | polymorphic (student\|teacher) | app-layer enforced |

Normalization notes:
- Redundant `semester` text columns (present in the original spec on courses/fees/transcripts) were replaced with a single `semester_id` FK to `semesters` to avoid update anomalies.
- Course `schedule` text field was normalized into `timetables`.

## REST API Endpoints (Node.js/Express)

### Auth
- `POST /api/auth/login` — student or teacher login (body includes `role`)
- `POST /api/auth/logout`
- `POST /api/auth/refresh` — rotate refresh token (HttpOnly cookie)
- `POST /api/auth/change-password`

### Students
- `GET /api/students/:id`
- `PATCH /api/students/:id`
- `GET /api/students/:id/transcript`
- `GET /api/students/:id/achievements`
- `GET /api/students/:id/fees`

### Teachers
- `GET /api/teachers/:id`
- `PATCH /api/teachers/:id`
- `GET /api/teachers/:id/courses`

### Courses
- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses` (teacher/admin)
- `PATCH /api/courses/:id`
- `DELETE /api/courses/:id`
- `GET /api/courses/:id/students` — roster
- `POST /api/courses/:id/enroll` (student)
- `DELETE /api/courses/:id/enroll/:studentId`

### Assessments & Grades
- `GET /api/courses/:id/assessments`
- `POST /api/courses/:id/assessments` (teacher)
- `PATCH /api/assessments/:id`
- `POST /api/assessments/:id/results` (teacher submits grade)
- `GET /api/students/:id/results`

### Attendance
- `GET /api/courses/:id/attendance?date=`
- `POST /api/courses/:id/attendance` (teacher, bulk mark)
- `GET /api/students/:id/attendance`

### Messages
- `GET /api/messages/inbox`
- `POST /api/messages`
- `PATCH /api/messages/:id/read`

### Timetable
- `GET /api/timetables/course/:courseId`
- `GET /api/timetables/student/:studentId`
- `GET /api/timetables/teacher/:teacherId`

### Resources & Announcements
- `GET /api/courses/:id/resources`
- `POST /api/courses/:id/resources` (teacher)
- `GET /api/courses/:id/announcements`
- `POST /api/courses/:id/announcements` (teacher)

## Security Notes
- Auth: JWT access token (short-lived, memory) + HttpOnly/Secure refresh cookie; role claim (`student`/`teacher`) checked on every protected route.
- All list endpoints paginated (`?page=&limit=`), all mutating endpoints validated with a schema library (zod/joi) server-side.
- File uploads (resources, profile pictures) validated by MIME/type + size, stored outside webroot, served via signed URLs.
- Every FK-bound write scoped to the authenticated user's own `student_id`/`teacher_id` unless role is admin — prevents IDOR.
