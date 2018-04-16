// Title: sendToAgents.js
// Author: Daniel Cooke 
// Date: 2018-04-14 16:55:18
const mysql = require('mysql');
const connection = require('../../data/dbSettings');
const sendEmailTo = require('./sendEmailTo');
const getRowDataAsObjects = require('./getRowDataAsObjects');


/**
 * Sends an email to all agents belonging to the provided problemID
 * @param {string} problemID
 * @param {(problem, agent, task ,organiser) => string} emailContentFunction  
 * @param {(problem, agent, task ,organiser) => string}  subjectContentFunction  
 * @param {(err, res) => } callback
 */
function sendToAgents(problemID, emailContentFunction, subjectContentFunction, callback) {
    const db = mysql.createConnection(connection);

    const problemQuery = `SELECT * FROM problems WHERE ProblemID =?` ;

    db.query(problemQuery, problemID, (err,res) => {

        const problem = res[0];
        if (problem.Finished) { // Send with survey answers

            selectAgentsWithSurveyAnswers(db, problemID, (err, res) => {
                const rows = res.map(getRowDataAsObjects);
                rows.map(row => {
                    const emailContent = emailContentFunction(row.problem, row.agent, row.task, row.organiser);
                    const subject = subjectContentFunction(row.problem, row.agent, row.task, row.organiser);
                    sendEmailTo(emailContent, subject, row.agent.Email);
                    callback(res, err);                    
                });
                
            });
            
        } else { // Send without survey answers
            
            selectAgents(db, problemID, (err, res) => {
                const rows = res.map(getRowDataAsObjects);
                rows.map(row => {
                    const emailContent = emailContentFunction(row.problem, row.agent, row.task, row.organiser);
                    const subject = subjectContentFunction(row.problem, row.agent, row.task, row.organiser);
                    sendEmailTo(emailContent, subject, row.agent.Email);
                    callback(res, err);
                });
            });
        }

    });

}

/**
 * 
 * @param {*} db - database connection 
 * @param {string} problemID  
 * @param {(err, res)} callback 
 */
function selectAgentsWithSurveyAnswers(db, problemID, callback) {
    db.query(`SELECT agents.Email, tasks.Name, tasks.TaskID, problem_agents.AnswerID, survey_answers.Cost
    ,problems.TaskAlias, problems.AgentAlias
    FROM assignments
    JOIN (agents, tasks, problems, problem_agents, survey_answers) ON assignments.ProblemID=?
    and agents.AgentID = assignments.AgentID
    and problems.ProblemID = assignments.ProblemID
    and tasks.TaskID = assignments.TaskID
    and problem_agents.AgentID = assignments.AgentID
    and survey_answers.AnswerID = problem_agents.AnswerID
    and survey_answers.TaskID = tasks.TaskID` , problemID, (err, res) => {

        callback(err, res);
        // TODO: this is sending organiser name as the task name, check what is happening
        
    });

}

/**
 * 
 * @param {*} db - database connection 
 * @param {string} problemID  
 * @param {(err, res)} callback 
 */
function selectAgents(db, problemID, callback) {
    db.query(`SELECT problems.TaskAlias, organisers.Name, problems.AgentAlias, agents.Email, problem_agents.SurveyID
    FROM problems
    JOIN (problem_agents, agents, organisers)
    ON problems.ProblemID = ?
    AND problem_agents.ProblemID = problems.ProblemID
    AND agents.AgentID = problem_agents.AgentId
    AND organisers.OrganiserID = problems.OrganiserID`, problemID, (err, res) => {
        
        callback(err, res)
    });
}


module.exports = exports = sendToAgents;