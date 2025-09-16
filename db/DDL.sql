SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Modules;
DROP TABLE IF EXISTS Questions;
DROP TABLE IF EXISTS Principles;
DROP TABLE IF EXISTS Donts;

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
    adminID INT,
    numMods INT NOT NULL DEFAULT 6,
    PRIMARY KEY (courseID),
    FOREIGN KEY (adminID) REFERENCES Admins(adminID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Modules (
	modID INT UNIQUE AUTO_INCREMENT NOT NULL,
    title VARCHAR(200),
    intro VARCHAR(300),
    slide BLOB,
    courseID INT NOT NULL,
    modNum INT NOT NULL,
    PRIMARY KEY (modID),
    FOREIGN KEY (courseID) REFERENCES Courses(courseID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Questions (
	questionID INT UNIQUE AUTO_INCREMENT NOT NULL,
    question VARCHAR(300) NOT NULL,
    answer VARCHAR(300) NOT NULL,
	modID INT NOT NULL,
    PRIMARY KEY (questionID),
    FOREIGN KEY (modID) REFERENCES Modules(modID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Principles (
	principleID INT UNIQUE AUTO_INCREMENT NOT NULL,
    principle VARCHAR(300),
    modID INT NOT NULL,
    PRIMARY KEY (principleID),
    FOREIGN KEY (modID) REFERENCES Modules(modID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Donts (
	dontID INT UNIQUE AUTO_INCREMENT NOT NULL,
    dont VARCHAR(300),
    reason VARCHAR(300),
    modID INT NOT NULL,
    PRIMARY KEY (dontID),
    FOREIGN KEY (modID) REFERENCES Modules(modID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DATA INSERTION -- 
INSERT INTO Admins (name, email, password)
VALUES	("daisy", "ramired@bu.edu", "totallySecure!");

INSERT INTO Courses (courseName, courseCode, adminID)
VALUES	("Software Quality, Testing, and Security Management", "CS633", 1),
		("testing in case have more than one course on here", "CS366", 1);

INSERT INTO Modules (modNum, title, intro, courseID)
VALUES	(1, "making a database for your project 1", "blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah", 1),
		(2, "making a database for your project 2", "blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah", 1),
		(3, "making a database for your project 3", "blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah", 1),
		(4, "making a database for your project 4", "blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah", 1),
		(5, "making a database for your project 5", "blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah", 1),
		(6, "making a database for your project 6", "blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah", 1),
        (1, "making a database for your project 1", "blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah blah bloah blah blah", 2);

INSERT INTO Questions (question, answer, modID)
VALUES	("how do i? 1", "u do it", 1),
		("how do i? 2", "u do it", 1),
		("how do i? 3", "u do it", 2),
        ("how do i? 1", "u do it", 7);
        
INSERT INTO Principles (principle, modID)
VALUES	("blah blah 1 principle", 1),
		("how do i? 2 principle", 1),
		("how do i? 3 principle", 2),
        ("how do i? 1 principle", 7);
        
INSERT INTO Donts (dont, reason, modID)
VALUES	("blah blah dont 1", "bc i said so", 1),
		("how do i? 2 dont", "bc i said so", 1),
		("how do i? 3 dont", "bc i said so", 2),
        ("how do i? 1 dont", "bc i said so", 7);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;