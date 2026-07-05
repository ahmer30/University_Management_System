# Requirements Document

## Introduction

The Student Dashboard is a polished, web-based University Management System interface that gives students a centralized hub to view their academic information, track course progress, monitor attendance, review grades, and analyze their performance. It consists of a persistent global shell (top navigation bar and collapsible left sidebar), a main dashboard view with quick stats and course cards, and dedicated detail pages for courses, analytics, profile, attendance, and more.

## Glossary

- **Student**: An authenticated user enrolled in one or more courses at the university.
- **Dashboard**: The main landing view presented after login, showing the welcome section, quick stats, course grid, and upcoming deadlines.
- **Shell**: The persistent global layout composed of the Top Navigation Bar and the Left Sidebar.
- **Top_Navigation_Bar**: The fixed header component containing the university logo, global search bar, notification bell, and profile avatar.
- **Left_Sidebar**: The collapsible vertical navigation panel containing the student's mini-profile and menu items.
- **Course_Card**: A visual card component representing a single enrolled course in the course grid.
- **Course_Detail_Page**: The dedicated page for a single course, accessible via the "Enter Course" button on a Course_Card.
- **Assessment**: A graded activity (exam, quiz, assignment, project) associated with a course.
- **Achievements_Analytics_Page**: The dedicated page showing performance graphs, GPA trend, skill radar chart, and gamification badges.
- **Profile_Page**: The dedicated page showing personal, academic, financial, and transcript information for the Student.
- **Notification_Bell**: The icon in the Top_Navigation_Bar that displays unread notification count and opens a notifications panel.
- **Deadline**: An upcoming due date for an Assessment.
- **CGPA**: Cumulative Grade Point Average, calculated across all completed semesters.
- **Semester_GPA**: The Grade Point Average for a single semester.
- **Skill_Radar_Chart**: A spider-web (radar) chart displaying the Student's proficiency across academic skill areas.
- **Bell_Curve_Chart**: A class distribution chart showing the score distribution for a given Assessment with the Student's score marked.
- **Badge**: A gamification achievement awarded to the Student upon meeting specific criteria.
- **Transcript**: A complete academic record listing all courses taken, grades received, and cumulative GPA across all semesters.

---

## Requirements

### Requirement 1: Global Shell — Top Navigation Bar

**User Story:** As a Student, I want a fixed top navigation bar always visible on every page, so that I can access global actions without scrolling.

#### Acceptance Criteria

1. THE Top_Navigation_Bar SHALL remain fixed at the top of the viewport on all pages and views.
2. THE Top_Navigation_Bar SHALL display the university logo and the text "University Management System" on its left side.
3. WHEN the Student clicks the university logo or the "University Management System" text, THE Dashboard SHALL reset and navigate to the main Dashboard view.
4. THE Top_Navigation_Bar SHALL display a global search bar in its center.
5. WHEN the Student submits a search query in the global search bar, THE Top_Navigation_Bar SHALL display results matching courses, instructors, and past assignments relevant to the Student's records.
6. THE Top_Navigation_Bar SHALL display a Notification_Bell icon on its right side.
7. WHEN the Student has unread notifications, THE Notification_Bell SHALL display a red badge showing the count of unread notifications.
8. WHEN the Student clicks the Notification_Bell, THE Top_Navigation_Bar SHALL display a notifications panel listing the Student's notifications.
9. THE Top_Navigation_Bar SHALL display a circular profile avatar with a visible border on its right side.
10. WHEN the Student clicks the profile avatar, THE Top_Navigation_Bar SHALL display a dropdown menu containing the options "My Profile," "Settings," and "Logout."
11. WHEN the Student selects "My Profile" from the profile avatar dropdown, THE Dashboard SHALL navigate to the Profile_Page.
12. WHEN the Student selects "Logout" from the profile avatar dropdown, THE Dashboard SHALL end the Student's session and redirect to the login page.

---

### Requirement 2: Global Shell — Left Sidebar

**User Story:** As a Student, I want a persistent left sidebar with navigation links, so that I can move between major sections of the application quickly.

#### Acceptance Criteria

1. THE Left_Sidebar SHALL be displayed on the left side of the viewport on all pages and views.
2. THE Left_Sidebar SHALL display the Student's profile picture, full name, and Student ID at the top of the panel.
3. THE Left_Sidebar SHALL contain the following menu items in order: Dashboard, My Courses, Attendance, Achievements & Analytics, Timetable, Messages.
4. THE Left_Sidebar SHALL display each menu item with both an icon and a text label.
5. WHEN the Student clicks the "Dashboard" menu item, THE Left_Sidebar SHALL navigate to the main Dashboard view.
6. WHEN the Student clicks the "My Courses" menu item, THE Left_Sidebar SHALL navigate to a page listing all current and past courses for the Student.
7. WHEN the Student clicks the "Attendance" menu item, THE Left_Sidebar SHALL navigate to the dedicated Attendance page.
8. WHEN the Student clicks the "Achievements & Analytics" menu item, THE Left_Sidebar SHALL navigate to the Achievements_Analytics_Page.
9. WHEN the Student clicks the "Timetable" menu item, THE Left_Sidebar SHALL navigate to the Timetable page.
10. WHEN the Student clicks the "Messages" menu item, THE Left_Sidebar SHALL navigate to the Messages page.
11. WHEN the Student activates the collapse control on the Left_Sidebar, THE Left_Sidebar SHALL collapse to display only icons, hiding text labels.
12. WHEN the Left_Sidebar is collapsed and the Student activates the expand control, THE Left_Sidebar SHALL expand to display both icons and text labels.

---

### Requirement 3: Dashboard — Welcome Section and Quick Stats

**User Story:** As a Student, I want a welcome section with a greeting and summary statistics on my dashboard, so that I can see my key academic status at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL display a greeting message in the format "Good [Time of Day], [Student Full Name]!" where Time of Day is "Morning," "Afternoon," or "Evening" based on the Student's local time.
2. THE Dashboard SHALL display a badge showing the current semester name (e.g., "Current Semester: Fall 2026").
3. THE Dashboard SHALL display four Quick Stats Cards horizontally: Current GPA, Courses Enrolled, Pending Assignments, and Overall Attendance.
4. THE Dashboard SHALL display the Student's current Semester_GPA value on the Current GPA card.
5. WHEN the Student's current Semester_GPA is higher than the previous semester's Semester_GPA, THE Current GPA card SHALL display a green upward arrow indicator.
6. WHEN the Student's current Semester_GPA is lower than the previous semester's Semester_GPA, THE Current GPA card SHALL display a red downward arrow indicator.
7. THE Dashboard SHALL display the count of courses the Student is currently enrolled in on the Courses Enrolled card.
8. WHEN the Student clicks the Courses Enrolled card, THE Dashboard SHALL filter the main content view to display enrolled courses.
9. THE Dashboard SHALL display the count of assessments with a status of pending submission on the Pending Assignments card.
10. WHEN the Student clicks the Pending Assignments card, THE Dashboard SHALL navigate to the pending assignments to-do list view.
11. THE Dashboard SHALL display the Student's overall attendance percentage across all enrolled courses on the Overall Attendance card.
12. THE Dashboard SHALL display a color-coded progress bar on the Overall Attendance card reflecting the attendance percentage.

---

### Requirement 4: Dashboard — Current Courses Grid

**User Story:** As a Student, I want a grid of my current course cards on the dashboard, so that I can quickly see course information and navigate into any course.

#### Acceptance Criteria

1. THE Dashboard SHALL display a "Your Registered Courses" section containing a grid of Course_Cards.
2. THE Dashboard SHALL display Course_Cards in a grid layout of three cards per row on standard desktop viewports.
3. THE Dashboard SHALL display a "View All" link in the "Your Registered Courses" section header.
4. WHEN the Student clicks the "View All" link, THE Dashboard SHALL navigate to the My Courses page listing all current and past courses.
5. EACH Course_Card SHALL display the course code in a colored pill badge, the course title, the instructor's name, a progress bar showing overall course completion percentage, and an "Enter Course" button.
6. WHEN the Student hovers over a Course_Card, THE Course_Card SHALL apply a lift visual effect (elevation/shadow increase).
7. WHEN the Student clicks the "Enter Course" button on a Course_Card, THE Dashboard SHALL navigate to the Course_Detail_Page for that course.

---

### Requirement 5: Dashboard — Upcoming Deadlines Widget

**User Story:** As a Student, I want an upcoming deadlines widget on my dashboard, so that I can stay aware of approaching assessment due dates.

#### Acceptance Criteria

1. THE Dashboard SHALL display an "Upcoming Deadlines" widget showing the next three Deadlines ordered by due date ascending.
2. WHEN a Deadline is due within 2 days (inclusive) from the current date, THE Dashboard SHALL display that Deadline's entry in red.
3. WHEN a Deadline is due between 3 and 7 days (inclusive) from the current date, THE Dashboard SHALL display that Deadline's entry in yellow.
4. WHEN a Deadline is due more than 7 days from the current date, THE Dashboard SHALL display that Deadline's entry in green.

---

### Requirement 6: Course Detail Page

**User Story:** As a Student, I want a dedicated course detail page with tabbed navigation, so that I can access all information related to a specific course in one place.

#### Acceptance Criteria

1. THE Course_Detail_Page SHALL display the course code, course title, instructor name, and instructor office hours in its top section.
2. THE Course_Detail_Page SHALL display a back button that navigates the Student to the previous page.
3. THE Course_Detail_Page SHALL provide tabbed navigation with the following tabs in order: Overview, Assessments, Grades, Attendance, Resources.
4. WHEN the Student selects the "Overview" tab, THE Course_Detail_Page SHALL display the course syllabus, course description, and any course announcements.
5. WHEN the Student selects the "Assessments" tab, THE Course_Detail_Page SHALL display a table of Assessments with columns: Title, Type, Weight, Due Date, Score, and Status.
6. WHEN the Student clicks on an Assessment row in the Assessments table, THE Course_Detail_Page SHALL display a modal containing the assessment's full details, a submission link, and any instructor feedback.
7. WHEN the Student selects the "Grades" tab, THE Course_Detail_Page SHALL display a detailed mark breakdown for each Assessment in the course.
8. WHEN the Student selects the "Attendance" tab, THE Course_Detail_Page SHALL display a calendar view marking each class session as present or absent for the Student.
9. WHEN the Student selects the "Resources" tab, THE Course_Detail_Page SHALL display a list of lecture slides and reading materials available for the course.

---

### Requirement 7: Achievements & Analytics Page

**User Story:** As a Student, I want an analytics page with performance graphs and achievement badges, so that I can understand my academic progress relative to peers and over time.

#### Acceptance Criteria

1. THE Achievements_Analytics_Page SHALL display a Relative Performance section containing a Bell_Curve_Chart showing the class score distribution for the selected Assessment.
2. THE Achievements_Analytics_Page SHALL display a marker on the Bell_Curve_Chart indicating the Student's score position within the class distribution.
3. THE Achievements_Analytics_Page SHALL provide a dropdown to select the course and a dropdown to select the Assessment for the Bell_Curve_Chart.
4. WHEN the Student changes the course or Assessment dropdown selection, THE Achievements_Analytics_Page SHALL update the Bell_Curve_Chart to reflect the newly selected course and Assessment.
5. THE Achievements_Analytics_Page SHALL display a Semester GPA Trend section containing a line graph of the Student's Semester_GPA over the last four completed semesters.
6. THE Achievements_Analytics_Page SHALL display a Skill Radar Chart section containing a Skill_Radar_Chart showing proficiency scores across skill areas including Programming, Mathematics, Writing, and Critical Thinking.
7. THE Achievements_Analytics_Page SHALL display a Badges section containing all Badges earned by the Student.
8. WHEN the Student has earned a Badge, THE Achievements_Analytics_Page SHALL display the Badge with its name and the criterion that was met (e.g., "Perfect Attendance," "Top 5% in CS-401").

---

### Requirement 8: Profile Page

**User Story:** As a Student, I want a dedicated profile page with tabs for personal, academic, and financial information, so that I can view and manage all my university records in one place.

#### Acceptance Criteria

1. THE Profile_Page SHALL display a profile picture upload area on its left side that allows the Student to upload a new profile picture.
2. WHEN the Student uploads a new profile picture, THE Profile_Page SHALL update the displayed profile picture and reflect the change in the Left_Sidebar and Top_Navigation_Bar avatar.
3. THE Profile_Page SHALL provide tabbed navigation on its right side with the following tabs in order: Personal Info, Academic Info, Financial Info, Transcript.
4. WHEN the Student selects the "Personal Info" tab, THE Profile_Page SHALL display the Student's full name, date of birth, contact information, and address.
5. WHEN the Student selects the "Academic Info" tab, THE Profile_Page SHALL display the Student's Student ID, program name, enrollment date, and academic advisor name.
6. WHEN the Student selects the "Financial Info" tab, THE Profile_Page SHALL display the Student's fee payment status and scholarship details.
7. WHEN the Student selects the "Transcript" tab, THE Profile_Page SHALL display a complete Transcript table listing all completed courses with their grades and the Student's CGPA.
8. THE Transcript table SHALL include columns for course code, course title, semester, credit hours, grade, and grade points.
9. THE Transcript table SHALL display the Student's cumulative CGPA calculated across all completed semesters at the bottom of the table.

---

### Requirement 9: Attendance Page

**User Story:** As a Student, I want a dedicated attendance page, so that I can review my attendance record across all courses in one place.

#### Acceptance Criteria

1. THE Attendance_Page SHALL display attendance records for all courses in which the Student is currently enrolled.
2. THE Attendance_Page SHALL display for each course the total number of sessions held, the number of sessions attended, and the attendance percentage.
3. WHEN the Student's attendance percentage for a course falls below 75%, THE Attendance_Page SHALL highlight that course's attendance record with a warning indicator.
4. THE Attendance_Page SHALL provide a filter control allowing the Student to view attendance for a specific course.

---

### Requirement 10: Responsive Layout and Accessibility

**User Story:** As a Student, I want the dashboard to adapt to different screen sizes and be accessible, so that I can use it on any device comfortably.

#### Acceptance Criteria

1. THE Dashboard SHALL display a responsive layout that adapts the course grid to a single-column layout on viewport widths below 768 pixels.
2. WHEN the viewport width is below 768 pixels, THE Left_Sidebar SHALL be hidden by default and accessible via a toggle control.
3. THE Dashboard SHALL ensure all interactive elements (buttons, links, form inputs, dropdowns) are keyboard navigable and have visible focus indicators.
4. THE Dashboard SHALL provide appropriate ARIA labels on all icon-only interactive elements so that screen readers can announce their purpose.
5. THE Dashboard SHALL maintain a color contrast ratio of at least 4.5:1 for all body text and interactive element labels against their backgrounds.
