
function getAssignmentResults(problemID, callback) {
   
    const mysql = require('mysql');
    const connection = require('../../data/dbSettings');

    db = mysql.createConnection(connection);

    db.query(`SELECT agents.Email, tasks.Name, tasks.TaskID, problem_agents.AnswerID, survey_answers.Cost
	,problems.TaskAlias, problems.AgentAlias
    FROM assignments
    JOIN (agents, tasks, problems, problem_agents, survey_answers) ON assignments.ProblemID=?
    and agents.AgentID = assignments.AgentID
    and problems.ProblemID = assignments.ProblemID
    and tasks.TaskID = assignments.TaskID
    and problem_agents.AgentID = assignments.AgentID
    and survey_answers.AnswerID = problem_agents.AnswerID
    and survey_answers.TaskID = tasks.TaskID`, problemID, callback);

}

module.exports = exports = getAssignmentResults;