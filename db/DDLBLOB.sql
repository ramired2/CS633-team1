SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Details;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Modules;

-- TABLE CREATIONS -- 
CREATE TABLE Admins (
	adminID INT UNIQUE AUTO_INCREMENT NOT NULL,
    fn VARCHAR(50) NOT NULL,
    ln VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL DEFAULT "plsChangeUrPassword",
    PRIMARY KEY (adminID)
);

CREATE TABLE Details (
	detailID INT UNIQUE AUTO_INCREMENT NOT NULL,
    content LONGTEXT,
    adminID INT NOT NULL,
    PRIMARY KEY (detailID),
    FOREIGN KEY (adminID) REFERENCES Admins(adminID) ON DELETE CASCADE ON UPDATE CASCADE
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
    modNum INT NOT NULL,
    title VARCHAR(200),
    modImg LONGBLOB NOT NULL,
    pictorial LONGBLOB NOT NULL,
    summary LONGBLOB NOT NULL,
    principles LONGBLOB NOT NULL,
    dont LONGBLOB NOT NULL,
    quiz LONGBLOB NOT NULL,
    question LONGBLOB NOT NULL,
    courseID INT NOT NULL,
    PRIMARY KEY (modID),
    FOREIGN KEY (courseID) REFERENCES Courses(courseID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DATA INSERTION -- 
INSERT INTO Admins (fn, ln, email, password)
VALUES	("daisy", "ramirez", "ramired@bu.edu", "totallySecure!");

INSERT INTO Details (content, adminID)
VALUES ("this is a description of the course. \nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
		\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
		\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
        1);

INSERT INTO Courses (courseName, courseCode, adminID)
VALUES	("Software Quality, Testing, and Security Management", "CS633", 1),
		("testing in case have more than one course on here", "CS366", 1);

INSERT INTO Modules (modNum, title, modImg, pictorial, summary, principles, dont, quiz, question, courseID)
VALUES	(1, "module 1", LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
						LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
						LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"),
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"),
                        1 ),
		(3, "module 1", LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
						LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
						LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"),
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"),
                        1 ),
		(2, "module 1", LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
						LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
						LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"), 
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"),
                        LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\testPic.jpg"),
                        1 );

SET FOREIGN_KEY_CHECKS=1;
COMMIT;