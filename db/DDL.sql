SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Weeks;
DROP TABLE IF EXISTS Questions;
DROP TABLE IF EXISTS Answers;
DROP TABLE IF EXISTS Deliverables;
DROP TABLE IF EXISTS Tasks;

-- TABLE CREATIONS -- 
CREATE TABLE Admins (
	adminID INT UNIQUE AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL DEFAULT "plsChangeUrPassword",
    PRIMARY KEY (adminID)
);

CREATE TABLE Courses (
	courseID INT UNIQUE AUTO_INCREMENT NOT NULL,
    courseName VARCHAR(200) UNIQUE,
    courseCode VARCHAR(45) UNIQUE,
    classStart DATETIME,
    classEnd DATETIME,
    adminID INT,
    numWeeks INT NOT NULL DEFAULT 15,
    PRIMARY KEY (courseID),
    FOREIGN KEY (adminID) REFERENCES Admins(adminID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Weeks (
	weekID INT UNIQUE AUTO_INCREMENT NOT NULL,
    weekNum INT NOT NULL,
    courseID INT NOT NULL,
    numQUestions INT NOT NULL DEFAULT 0,
    numAnswers INT NOT NULL DEFAULT 0,
    PRIMARY KEY (weekID),
    FOREIGN KEY (courseID) REFERENCES Courses(courseID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Questions (
	questionID INT UNIQUE AUTO_INCREMENT NOT NULL,
    question VARCHAR(300) NOT NULL,
    posted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    upVote INT NOT NULL DEFAULT 0,
    hasAnswer INT DEFAULT NULL,
    isAnonym VARCHAR(45) DEFAULT NULL,
	courseID INT NOT NULL,
    weekID INT NOT NULL,
    PRIMARY KEY (questionID),
    FOREIGN KEY (hasAnswer) REFERENCES Answers(answerID) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (courseID) REFERENCES Courses(courseID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (weekID) REFERENCES Weeks(weekID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Answers (
	answerID INT UNIQUE AUTO_INCREMENT NOT NULL,
    answer VARCHAR(300),
    PRIMARY KEY (answerID)
);

CREATE TABLE Deliverables (
	deliverableID INT UNIQUE AUTO_INCREMENT NOT NULL,
    weekID INT NOT NULL,
    courseID INT NOT NULL,
    PRIMARY KEY (deliverableID),
    FOREIGN KEY (weekID) REFERENCES Weeks(weekID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (courseID) REFERENCES Courses(courseID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Tasks (
	taskID INT UNIQUE AUTO_INCREMENT NOT NULL,
    task VARCHAR(300),
    link VARCHAR(300),
    dueDate DATETIME,
    deliverableID INT NOT NULL,
    PRIMARY KEY (taskID),
    FOREIGN KEY (deliverableID) REFERENCES Deliverables(deliverableID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DATA INSERTION -- 
INSERT INTO Admins (name, email, password)
VALUES	("daisy", "ramired@bu.edu", "totallySecure!");

INSERT INTO Courses (courseName, courseCode, classStart, classEnd, adminID)
VALUES	("Software Quality, Testing, and Security Management", "CS633", (CAST('2025-09-03 18:00:00.000' AS DateTime)), (CAST('2025-12-17 18:00:00.000' AS DateTime)), 1),
        ("Introduction to Software Engineering", "CS473", (CAST('2025-08-02 18:00:00.000' AS DateTime)), (CAST('2025-12-17 18:00:00.000' AS DateTime)), 1),
		("Software Engineering", "CS 673", (CAST('2025-03-09 18:00:00.000' AS DateTime)), (CAST('2025-12-17 18:00:00.000' AS DateTime)), 1);

-- BU has 15 weeks per semester
INSERT INTO Weeks (weekNum, numQuestions, numAnswers, courseID)
VALUES	(1, 2, 1, 1), (2, 0, 0, 1), (3, 0, 0, 1), (4, 0, 0, 1), (5, 0, 0, 1), (6, 0, 0, 1), (7, 0, 0, 1), (8, 0, 0, 1), (9, 0, 0, 1), (10, 0, 0, 1), (11, 0, 0, 1), (12, 0, 0, 1), (13, 0, 0, 1), (14, 0, 0, 1), (15, 0, 0, 1),
		(1, 0, 0, 2), (2, 2, 1, 2), (3, 0, 0, 2), (4, 0, 0, 2), (5, 0, 0, 2), (6, 0, 0, 2), (7, 0, 0, 2), (8, 0, 0, 2), (9, 0, 0, 2), (10, 0, 0, 2), (11, 0, 0, 2), (12, 0, 0, 2), (13, 0, 0, 2), (14, 0, 0, 2), (15, 0, 0, 2),
        (1, 0, 0, 3), (2, 0, 1, 3), (3, 0, 0, 3), (4, 0, 0, 3), (5, 0, 0, 3), (6, 0, 0, 3), (7, 0, 0, 3), (8, 0, 0, 3), (9, 0, 0, 3), (10, 0, 0, 3), (11, 0, 0, 3), (12, 0, 0, 3), (13, 0, 0, 3), (14, 0, 0, 3), (15, 0, 0, 3);

INSERT INTO Questions (question, courseID, weekID, upVote, hasAnswer, isAnonym)
VALUES	("what were the three attributes?", 1, 1, 0, 2, 1),
		("What is this weeks book", 1, 1, 0, NULL, 1),
        ("week two q", 2, 17, 0, NULL, 1),
        ("week two q verbal answer", 2, 17, 0, 1, 1);
        
INSERT INTO Answers (answer)
	VALUES	("verbal"),
			("attribute 1, 2, 3");

INSERT INTO Deliverables (weekID, courseID)
VALUES	(1, 1), (2, 1), (17, 2);

INSERT INTO Tasks (deliverableID, task, link, dueDate)
VALUES	(1, "week one: course 1 task 1", "https://www.barnesandnoble.com/w/katabasis-r-f-kuang/1145125207?ean=9780063021471", (CAST('2025-09-24 18:00:00.000' AS DateTime))),
		(1, "week 1 course 1 task 2", "https://www.barnesandnoble.com/w/never-flinch-stephen-king/1146567426?ean=9781668089330", (CAST('2025-09-24 18:00:00.000' AS DateTime))),
        (2, "week 2: course 1 task 1", "https://www.barnesandnoble.com/w/everything-is-tuberculosis-john-green/1146442015?ean=9780525556572", (CAST('2025-09-28 18:00:00.000' AS DateTime))),
        (3, "week 2: course 2 task 1", "https://www.barnesandnoble.com/w/everything-is-tuberculosis-john-green/1146442015?ean=9780525556572", (CAST('2025-09-28 18:00:00.000' AS DateTime))),
        (3, "week 2: course 2 task 2", "https://www.barnesandnoble.com/w/everything-is-tuberculosis-john-green/1146442015?ean=9780525556572", (CAST('2025-09-28 18:00:00.000' AS DateTime)));

SET FOREIGN_KEY_CHECKS=1;
COMMIT;