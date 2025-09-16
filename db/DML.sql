-- ----------------------------
-- 		Admins
-- ----------------------------

-- INSERT --
	-- insert an admin 
    -- auto generate password and have them later change it to their personal pref
    INSERT INTO Admins (name, email)
		VALUES	(:name, :email);

-- SELECT --
	-- select all admins
    SELECT * FROM Admins;

-- UPDATE
	-- update email only
    UPDATE Admins SET email = :email;
    
    -- update password only
    UPDATE Admins SET password = :password;
    
    -- update all info
    UPDATE Admins SET name = :adminName, email = :email, password = :password
		WHERE adminID =:id;
		
-- DELETE
	-- delete specific admin
    DELETE FROM Admins WHERE adminID = :adminID;
    
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
    INSERT INTO Modules (modNum, title, intro, courseID)
		VALUES (:numberOfModules, :title, :intro, :courseID)

-- SELECT --
	-- select all modules 
    SELECT * FROM Modules 
    
    -- select slide, title, intro from specific module
    SELECT Modules.modID, Modules.modNum, Modules.courseID, Modules.slide, Modules.title, Modules.intro
    FROM Modules
    WHERE Modules.modID = 1
    
-- UPDATE
	-- update 
    UPDATE Modules SET modNum = :numMods, title=:newTitle, intro=:newintro, courseID=:newCourse
		WHERE modID = :modID;
		
-- DELETE
	-- delete a 
    DELETE FROM Modules WHERE modID = :modID;

    
-- ----------------------------
-- 		Questions
-- ----------------------------

-- INSERT --
	-- insert a question (date posted will auto generate)
    INSERT INTO Questiosn (question, answer, modID)
		VALUES	(:question, :answer, :modID);

-- SELECT -- 
	-- select all questions from a specific module and course
    SELECT Questions.questionID, Questions.question, Questions.answer, Questions.modID, Modules.modNum, Modules.courseID
		FROM Questions
        INNER JOIN Modules ON Questions.modID = Modules.modID
        WHERE Questions.modID = :modID && Modules.courseID = :courseID; -- modID or maybe change to Modules.modNum 
	
    -- select all qs from a course
	SELECT Questions.questionID, Questions.question, Questions.answer, Questions.modID, Modules.modNum, Modules.courseID
		FROM Questions
        INNER JOIN Modules ON Questions.modID = Modules.modID
        WHERE Modules.courseID = :courseID
        
-- UPDATE
	-- update 
    UPDATE Questions SET question = :q, answer=:a, modID=:modID
		WHERE modID = :modID;
		
-- DELETE
	-- delete a 
    DELETE FROM Questions WHERE modID = :modID;

  
-- ----------------------------
-- 		Principles
-- ----------------------------

-- INSERT --
	-- inserting a new 
    INSERT INTO Principles (principle, modID)
		VALUES (:princple, :modID)

-- SELECT --
	-- select 
    SELECT *
		FROM Principles 
        
	-- select principles from a specific module and course
    SELECT Modules.modID, Modules.modNum AS numMod, Principles.principleID, Principles.principle, Modules.courseID
		FROM Principles
        INNER JOIN Modules ON Modules.modID = Principles.modID
        WHERE Principles.modID = :modID && Modules.courseID = :courseID; -- modID or maybe change to Modules.modNum 
    
    -- select all from specific course
	SELECT Modules.modID, Modules.modNum AS numMod, Principles.principleID, Principles.principle, Modules.courseID
			FROM Principles
			INNER JOIN Modules ON Modules.modID = Principles.modID
			WHERE Modules.courseID = :courseID;
-- UPDATE
	-- update 
    UPDATE Principles SET principle=:principle, modID=:modiD
		WHERE ;
		
-- DELETE
	-- delete a 
    DELETE FROM Principles WHERE principleID = :id;

     
-- ----------------------------
-- 		Donts
-- ----------------------------

-- INSERT --
	-- inserting a new 
    INSERT INTO Donts (dont, reason, modID)
		VALUES (:rule, :reasonwhy, :modID)

-- SELECT --
	-- select all the donts from a specific course and module 
    SELECT Donts.dontID, Donts.item, Donts.reason, Modules.modID, Modules.courseID
		FROM Donts
        INNER JOIN Modules ON Donts.modID = Modules.modID
        WHERE Modules.modID = :id && Modules.courseID =:courseID

-- UPDATE
	-- update 
    UPDATE Donts SET dont=:dont, reason=:reason, modID=:modiD
		WHERE dontID =:id;
		
-- DELETE
	-- delete a 
    DELETE FROM Donts WHERE dontID =:id;;
