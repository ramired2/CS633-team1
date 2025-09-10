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
    UPDATE Admins SET name = :adminName, email = :email, password = :password;
		
-- DELETE
	-- delete specific admin
    DELETE FROM Admins WHERE adminID = :adminID;
    
-- ----------------------------
-- 		Courses
-- ----------------------------

-- INSERT --
	-- insert a course that the prof/admin has
    INSERT INTO Courses (courseName, courseCode, classStart, classEnd, adminID)
		VALUES	(:officialCourseName, :courseCode, :startDate, :endDate, :profID

-- SELECT --
	-- select all courses
    SELECT * FROM Courses;
    
    -- select course codes and course start/end date
    SELECT Courses.courseID, Courses.courseCode, Courses.classStart, Courses.classEnd
		FROM Courses 
        ORDER BY Courses.courseCode ASC;
        
	-- select courses that a specific admin is in charge of
    SELECT Courses.courseID, Courses.courseCode, Courses.classStart, Courses.classEnd
		FROM Courses 
        WHERE adminID = :adminId
		ORDER BY Courses.courseCode ASC;
        
-- UPDATE
	-- update course details
    UPDATE Courses SET courseName = :courseName, courseCode = :courseCode,  classStart = :dateTimeStart, classEnd = :dateTimeEnd
		WHERE courseID = :courseID;
		
-- DELETE
	-- delete course
    DELETE FROM Courses WHERE courseID = :courseID;
    
-- ----------------------------
-- 		Weeks
-- ----------------------------

-- INSERT --
	-- add in a new week
    -- BU has a total of fifteen weeks
    INSERT INTO Weeks (weekNum, courseID, numQuestions, numAnswers)
		VALUES	(:weekFromTerm, :courseID, 0, 0);

-- SELECT --
	-- select all weeks data from q's/answers
    SELECT * FROM Weeks 
		ORDER BY Weeks.weekID;
        
	-- select all weeks in a course but order by num questions asked per week
    SELECT  Weeks.weekID, Weeks.weekNum, Weeks.courseID, Courses.courseName, Courses.courseCode, Weeks.numQuestions, Weeks.numAnswers
		FROM Weeks
        INNER JOIN Courses ON Weeks.courseID = Courses.courseID
		WHERE Courses.courseID = :courseID
        ORDER BY Weeks.numQuestions DESC;
        
-- UPDATE
	-- inc count of answered questions by 1
    UPDATE Weeks SET numAnswers = numAnswers + 1
		WHERE Weeks.weekID = :weekid;
        
	-- inc count of questions asked by 1
    UPDATE Weeks SET numQuestions = numQuestions + 1
		WHERE Weeks.weekID = :weekid;
        
	-- dec count answered by one if post deleted by 1
    UPDATE Weeks SET numAnswers = numAnswers - 1
		WHERE Weeks.weekID = :weekid;
        
	-- dec count q by 1
    UPDATE Weeks SET numQuestions = numQuestions - 1
		WHERE Weeks.weekID = :weekid;
		
-- DELETE
	-- delete a week
    DELETE FROM Weeks WHERE weekID = :weekID;
    
-- ----------------------------
-- 		Questions
-- ----------------------------

-- INSERT --
	-- insert a question (date posted will auto generate)
    INSERT INTO Posts (question, courseID, weekID, upVote, hasAnswer, isAnonym)
		VALUES	(:question, :courseID, :weekID, :upvote, :hasAnswer, :isAnonymous);

-- SELECT -- 
	-- select all questions
    SELECT Questions.questionID, Questions.weekID, Weeks.weekNum, Courses.courseID, Questions.posted, Questions.question, Questions.hasAnswer, Answers.answer, Questions.upVote, Questions.isAnonym
		FROM Questions
        INNER JOIN Weeks ON Questions.weekID = Weeks.weekID
        LEFT JOIN Answers ON Questions.hasAnswer = Answers.answerID
        INNER JOIN Courses ON Questions.courseID = Courses.courseID
        ORDER BY Questions.posted DESC;
        
	-- select all questions with an answer from the whole course (verbal and written)
	SELECT Questions.questionID, Questions.weekID, Weeks.weekNum, Courses.courseID, Questions.posted, Questions.question, Questions.hasAnswer, Answers.answer, Questions.upVote, Questions.isAnonym
		FROM Questions
        INNER JOIN Weeks ON Questions.weekID = Weeks.weekID
        LEFT JOIN Answers ON Questions.hasAnswer = Answers.answerID
        INNER JOIN Courses ON Questions.courseID = Courses.courseID
        WHERE (Courses.courseID = :courseID AND Questions.hasAnswer >= 1)
        ORDER BY Questions.posted DESC;
        
	-- select all questions with written aswers from the whole course
	SELECT Questions.questionID, Questions.weekID, Weeks.weekNum, Courses.courseID, Questions.posted, Questions.question, Questions.hasAnswer, Answers.answer, Questions.upVote, Questions.isAnonym
		FROM Questions
        INNER JOIN Weeks ON Questions.weekID = Weeks.weekID
        INNER JOIN Answers ON Questions.hasAnswer = Answers.answerID
        INNER JOIN Courses ON Questions.courseID = Courses.courseID
        WHERE (Questions.hasAnswer > 1 AND Courses.courseID = :courseID)
        ORDER BY Questions.posted DESC;
    
    -- get all questions from a course during a specific week
    SELECT Questions.questionID, Questions.weekID, Weeks.weekNum, Courses.courseID, Questions.posted, Questions.question, Questions.hasAnswer, Answers.answer, Questions.upVote, Questions.isAnonym
		FROM Questions
        INNER JOIN Weeks ON Questions.weekID = Weeks.weekID
        LEFT JOIN Answers ON Questions.hasAnswer = Answers.answerID
        INNER JOIN Courses ON Questions.courseID = Courses.courseID
        WHERE (Courses.courseID = :courseID AND Weeks.weekID = :weekID) -- maybe change to Weeks.numWeek
        ORDER BY Questions.posted DESC;
        
	-- select all questions with an answer from the whole course (verbal and written) from a specific week
	SELECT Questions.questionID, Questions.weekID, Weeks.weekNum, Courses.courseID, Questions.posted, Questions.question, Questions.hasAnswer, Answers.answer, Questions.upVote, Questions.isAnonym
		FROM Questions
        INNER JOIN Weeks ON Questions.weekID = Weeks.weekID
        LEFT JOIN Answers ON Questions.hasAnswer = Answers.answerID
        INNER JOIN Courses ON Questions.courseID = Courses.courseID
        WHERE (Courses.courseID = :courseID AND Questions.hasAnswer >= 1 AND Weeks.weekID = :weekID) -- maybe change to Weeks.numWeek
        ORDER BY Questions.posted DESC;
        
	-- select all questions with written aswers from the whole course from a week
	SELECT Questions.questionID, Questions.weekID, Weeks.weekNum, Courses.courseID, Questions.posted, Questions.question, Questions.hasAnswer, Answers.answer, Questions.upVote, Questions.isAnonym
		FROM Questions
        INNER JOIN Weeks ON Questions.weekID = Weeks.weekID
        INNER JOIN Answers ON Questions.hasAnswer = Answers.answerID
        INNER JOIN Courses ON Questions.courseID = Courses.courseID
        WHERE (Questions.hasAnswer > 1 AND Courses.courseID = :courseID AND Weeks.weekID = :weekID) -- maybe change to Weeks.numWeek
        ORDER BY Questions.posted DESC;

-- UPDATE
	-- update the question asked
    UPDATE Questions SET question = :edited
		WHERE questionID = :questionID;
        
	-- mark a question as answered
    -- NULL -> no answer
    -- 1 -> verbal answer
    -- >= 2 written (idx of answerID)
	UPDATE Questions SET hasAnswer = :answerType
		WHERE postID = :postID
        
	-- mark a post as no answer
	UPDATE Questions SET hasAnswer = NULL
		WHERE postID = :postID
        
	-- inc upvote by 1
    UPDATE Questions SET upvote = upvote + 1
		WHERE Questions.questionID = :questionID;
        
	-- dec upvote by 1
    UPDATE Questions SET upvote = upvote + 1
		WHERE Questions.questionID = :questionID;
        
    -- change post to anonymous manipulations
	UPDATE Questions SET isAnonym = NULL
		WHERE Questions.questionID = :questionID
        
	-- update post to an individuals name
	UPDATE Questions SET isAnonym = :name
		WHERE Questions.questionID = :questionID
        
-- DELETE
	-- DELETE post
    DELETE FROM Posts WHERE postID = :postID
  
-- ----------------------------
-- 		Answers
-- ----------------------------

-- INSERT --
	-- inserting a new answer
    INSERT INTO Answers (answer) VALUES	(:answer)

-- SELECT --
	-- select all answers
    SELECT * FROM Answers

-- UPDATE
	-- update the content of an answer
    UPDATE Answers SET answer = :editedAnswer
		WHERE Answers.answerID = :answerID
		
-- DELETE
	-- 
     DELETE FROM Answers WHERE answerID = :answerID
     
-- ----------------------------
-- 		Deliverables
-- ----------------------------

-- INSERT --
	-- inserting a new deliverable
    INSERT INTO Deliverables (weekID, courseID)
		VALUES (:weekID, courseID)

-- SELECT --
	-- select deliverables from a certain course for all weeks
    SELECT Deliverables.deliverableID, Deliverables.weekID, Weeks.weekNum, Weeks.courseID, Courses.courseID, Courses.courseCode, Tasks.taskID, Tasks.task, Tasks.link, Tasks.dueDate
		FROM Tasks
        INNER JOIN Deliverables ON Tasks.deliverableID = Deliverables.deliverableID
		INNER JOIN Weeks ON Deliverables.weekID = Weeks.weekID
		INNER JOIN Courses ON Deliverables.courseID = Courses.courseID
        WHERE Courses.courseID = :courseID
    
    -- select deliverables from a course for a certain week
    SELECT Deliverables.deliverableID, Deliverables.weekID, Weeks.weekNum, Weeks.courseID, Courses.courseID, Courses.courseCode, Tasks.taskID, Tasks.task, Tasks.link, Tasks.dueDate
		FROM Tasks
        INNER JOIN Deliverables ON Tasks.deliverableID = Deliverables.deliverableID
		INNER JOIN Weeks ON Deliverables.weekID = Weeks.weekID
		INNER JOIN Courses ON Deliverables.courseID = Courses.courseID
        WHERE Courses.courseID = :courseID AND Weeks.weekNum = :weekNumber
        ORDER BY Tasks.dueDate;

-- UPDATE
	-- update deliverable week and course
    UPDATE Deliverables SET weekID = :weekID, courses = :courseID
		WHERE deliverableID = :deliverableID;
		
-- DELETE
	-- delete a deliverable
    DELETE FROM Deliverables WHERE deliverableID = :deliverableID;
    
-- ----------------------------
-- 		Tasks
-- ----------------------------

-- INSERT --
	-- inserting a new task
    INSERT INTO Tasks (deliverableID, task, link, dueDate)
		VALUES (:deliverableID, :taskDescription, :link, :dueDate);

-- SELECT --
	-- select all tasks
    SELECT * FROM Tasks
    
    -- other selects in Deliverables section

-- UPDATE
	-- update task description, due date, and link
    UPDATE Tasks SET task = :editedTask, link = :fixedLink, dueDate = :newDueDate
		WHERE taskID = :taskID
		
-- DELETE
	-- delete a task
    DELETE FROM Tasks WHERE taskID = :taskID
    