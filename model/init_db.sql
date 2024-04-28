-- Create homeworks table
CREATE TABLE homeworks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    assignment VARCHAR(255),
    description TEXT,
    due_date DATE,
    priority VARCHAR(255),
    completed TINYINT(1),
    pastdue TINYINT(1)
);

-- Create students table
CREATE TABLE students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    username VARCHAR(255),
    avatar VARCHAR(255),
    password VARCHAR(255) NOT NULL
);

-- Create subjects table
CREATE TABLE subjects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);

-- Create teachers table
CREATE TABLE teachers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(255),
    lastname VARCHAR(255)
);

-- Create students_subjects_homeworks junction table
CREATE TABLE students_subjects_homeworks (
    studentID BIGINT NOT NULL,
    subjectID BIGINT NOT NULL,
    homeworkID BIGINT NOT NULL,
    teacherID BIGINT,
    PRIMARY KEY (studentID, subjectID, homeworkID),
    FOREIGN KEY (studentID) REFERENCES students(id),
    FOREIGN KEY (subjectID) REFERENCES subjects(id),
    FOREIGN KEY (homeworkID) REFERENCES homeworks(id),
    FOREIGN KEY (teacherID) REFERENCES teachers(id)
);



-- ADD CONSTRAINTS (already included in table creation)

-- ADD VALUES
INSERT INTO students (firstname, lastname, email, username, avatar, password) VALUES
('John', 'Doe', 'john.doe@example.com', 'johndoe', 'https://example.com/avatar.jpg', 'helloworld77');

INSERT INTO subjects (name) VALUES
('Mathematics'),
('Science'),
('History'),
('German'),
('English'),
('Art');

INSERT INTO teachers (firstname, lastname) VALUES
('John', 'Smith'),
('Emma', 'Miller'),
('Anna', 'Schmidt'),
('Max', 'Müller');

INSERT INTO homeworks (assignment, description, due_date, priority, completed, pastdue) VALUES
('Math Assignment 1', 'Complete exercises 1-10 on page 50.', '2024-04-25', 'High', 0, 0),
('Science Lab Report', 'Write a lab report for the experiment conducted in class.', '2024-04-28', 'Medium', 0, 0),
('History Essay', 'Write a 3-page essay on the causes of World War II.', '2024-04-30', 'High', 0, 0),
('Mathematics Worksheet: Multiplication', 'Complete the multiplication worksheet provided in class.', '2024-04-25', 'Medium', 0, 0),
('Mathematics Word Problems', 'Solve the word problems involving multiplication and division.', '2024-04-28', 'High', 0, 0),
('Mathematics Test: Fractions', 'Prepare for the upcoming test on fractions.', '2024-04-30', 'High', 0, 0),
('Science Experiment Report', 'Write a report on the experiment conducted in class.', '2024-04-25', 'Medium', 0, 0),
('Science Project: Solar System Model', 'Start working on your solar system model project.', '2024-04-28', 'High', 0, 0),
('Science Test: Ecosystems', 'Review the material for the test on ecosystems.', '2024-04-30', 'High', 0, 0),
('History Reading: Ancient Civilizations', 'Read the assigned chapters on ancient civilizations and take notes.', '2024-04-25', 'Medium', 0, 0),
('History Project: Famous Figures Research', 'Research a famous figure from history and prepare a presentation.', '2024-04-28', 'High', 0, 0),
('History Test: Middle Ages', 'Study for the test on the Middle Ages.', '2024-04-30', 'High', 0, 0),
('Math Assignment 2', 'Complete exercises 11-20 on page 52.', '2024-04-29', 'High', 0, 0),
('Science Experiment Report', 'Write a report on the experiment conducted in class.', '2024-04-25', 'Medium', 0, 0),
('German Vocabulary Quiz', 'Study and prepare for the upcoming vocabulary quiz in German class.', '2024-04-25', 'Medium', 0, 0),
('English Literature Essay', 'Write an essay analyzing a piece of English literature assigned in class.', '2024-04-27', 'High', 0, 0),
('German Grammar Exercise', 'Complete the grammar exercises assigned in German class.', '2024-04-27', 'High', 0, 0),
('German Reading Comprehension', 'Read a German text and answer comprehension questions.', '2024-04-29', 'High', 0, 0),
('English Grammar Exercises', 'Complete grammar exercises focusing on sentence structure and punctuation.', '2024-04-27', 'High', 0, 0),
('English Vocabulary Quiz', 'Study and prepare for the upcoming vocabulary quiz in English class.', '2024-04-29', 'High', 0, 0),
('Art Project: Still Life Drawing', 'Create a still life drawing using various art techniques.', '2024-04-25', 'Medium', 0, 0),
('Art History Research Paper', 'Research and write a paper on a famous artist or art movement.', '2024-04-27', 'High', 0, 0),
('Art Appreciation Presentation', 'Prepare a presentation discussing a famous artwork and its significance.', '2024-04-29', 'High', 0, 0);

-- Insert into students_subjects_homeworks table

-- Add entries for Math subject (ID: 1)
INSERT INTO students_subjects_homeworks (studentID, subjectID, homeworkID, teacherID)
VALUES
(1, 1, 1, 1),
(1, 1, 4, 1),
(1, 1, 5, 1),
(1, 1, 6, 1),
(1, 1, 13, 1);

-- Add entries for Science subject (ID: 2)
INSERT INTO students_subjects_homeworks (studentID, subjectID, homeworkID, teacherID)
VALUES
(1, 2, 2, 1),
(1, 2, 7, 1),
(1, 2, 8, 1),
(1, 2, 9, 1),
(1, 2, 14, 1);

-- Add entries for History subject (ID: 3)
INSERT INTO students_subjects_homeworks (studentID, subjectID, homeworkID, teacherID)
VALUES
(1, 3, 3, 2),
(1, 3, 10, 2),
(1, 3, 11, 2),
(1, 3, 12, 2);

-- Add entries for German subject (ID: 4)
INSERT INTO students_subjects_homeworks (studentID, subjectID, homeworkID, teacherID)
VALUES
(1, 4, 15, 1),
(1, 4, 17, 1),
(1, 4, 18, 1);

-- Add entries for English subject (ID: 5)
INSERT INTO students_subjects_homeworks (studentID, subjectID, homeworkID, teacherID)
VALUES
(1, 5, 16, 4),
(1, 5, 19, 4),
(1, 5, 20, 4);

-- Add entries for Art subject (ID: 6)
INSERT INTO students_subjects_homeworks (studentID, subjectID, homeworkID, teacherID)
VALUES
(1, 6, 21, 3),
(1, 6, 22, 3),
(1, 6, 23, 3);
