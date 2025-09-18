-- ----------------------------
-- 		Admins
-- ----------------------------

-- INSERT --
	-- insert an admin 
    -- auto generate password and have them later change it to their personal pref
    INSERT INTO Admins (fn, ln, email)
		VALUES	(:fn, :ln, :email);

-- SELECT --
	-- select all admins
    SELECT * FROM Admins;

-- UPDATE
	-- update email only
    UPDATE Admins SET email = :email;
    
    -- update password only
    UPDATE Admins SET password = :password;
    
    -- update all info
    UPDATE Admins SET fn = :fn, ln = :ln email = :email, password = :password
		WHERE adminID =:id;
		
-- DELETE
	-- delete specific admin
    DELETE FROM Admins WHERE adminID = :adminID;
    
-- ----------------------------
-- 		DETAILS
-- ----------------------------

-- INSERT --
    -- insert homepage details
    INSERT INTO Details (content, adminID)
		VALUES (:content, :adminID);

-- SELECT --
	-- select the course detail info
    SELECT * FROM Details;
    
    -- select content info for homepage (not module links)
    SELECT Details.detailID, Details.content, CONCAT(Admins.fn, " ", Admins.ln) AS name, Admins.email
		FROM Details
        INNER JOIN Admins ON Details.adminID = Admins.adminID;

-- UPDATE
	-- update the course welcoming text
    UPDATE Details SET content = :editedContent
		
-- DELETE
	-- delete specific admin
    DELETE FROM Details WHERE detailID = :detailID;
    
-- ----------------------------
-- 		Courses
-- ----------------------------

-- INSERT --
	-- insert a course that the prof/admin has
    INSERT INTO Courses (courseName, courseCode, adminID, :numModules)
		VALUES	(:officialCourseName, :courseCode, :profID, :numModules);

-- SELECT --
	-- select all courses
    SELECT * FROM Courses;
    
	-- select courses that a specific admin is in charge of
    SELECT Courses.courseID, Courses.courseName, Courses.courseCode, Courses.numMods
		FROM Courses 
        WHERE adminID = :adminId
		ORDER BY Courses.courseCode ASC;
        
-- UPDATE
	-- update course details
    UPDATE Courses SET courseName = :courseName, courseCode = :courseCode,  numMods = :numModules
		WHERE courseID = :courseID;
		
-- DELETE
	-- delete course
    DELETE FROM Courses WHERE courseID = :courseID;
    
-- ----------------------------
-- 		Modules
-- ----------------------------

-- INSERT --
	-- inserting a new 
    INSERT INTO Modules (modNum, title, pictorial, summary, principles, dont, quiz, question, courseID)
		VALUES (:numberOfModules, :title, :pictorial, :summary, :principles, :dont, :quiz, :question, :courseID);

-- SELECT --
	-- select all modules 
    SELECT * FROM Modules;
    
    -- select slide, title, intro from specific module
    SELECT Modules.modID, Modules.modNum, Modules.title, Modules.modImg, Modules.pictorial, Modules.summary, Modules.principles, Modules.dont, Modules.quiz, Modules.question, Modules.courseID
		FROM Modules
		WHERE Modules.modID = :modID;
    
    -- select module info from all modules
	SELECT Modules.modID, Modules.modNum, Modules.title, Modules.modImg, Modules.pictorial, Modules.summary, Modules.principles, Modules.dont, Modules.quiz, Modules.question, Modules.courseID
		FROM Modules
		ORDER BY Modules.modNum
    
-- UPDATE
	-- update 
    UPDATE Modules SET modNum = :modNum, title = :title, modImg = :modimg, pictorial= :pictorial, summary = :summary, principles = :principles, dont = :dont, quiz = :quiz, question = :question, courseID = :courseID
		WHERE modID = :modID;
		
-- DELETE
	-- delete a 
    DELETE FROM Modules WHERE modID = :modID;