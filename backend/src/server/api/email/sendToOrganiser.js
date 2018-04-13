const mysql = require('mysql');
const connection = require('../../data/dbSettings');
const sendEmailTo = require('./sendEmailTo');
const getRowDataAsObjects = require('./getRowDataAsObjects');

/**
 * @callback contentFunction
 * @param {Object} problem
 * @param {Object} agent
 * @param {Object} task
 * @param {Object} organiser
 * @return {string} emailMessage
 */

 /**
 * @callback responseCallback
 * @param {string} err
 * @return {string} res
 */

/**
 * @param {string} problemID
 * @param {contentFunction} emailContentFunction  
 * @param {contentFunction} subjectContentFunction  
 * @param {responseCallback} callback
 **/
function sendToOrganiser(problemID, emailContentFunction, subjectContentFunction, callback) {
    const db = mysql.createConnection(connection);

    const query = `SELECT * FROM problems
    JOIN (organisers) ON 
    problems.ProblemID = ?
    and problems.OrganiserID = organisers.OrganiserID`;

    db.query(query, problemID, (err,res) => {
        const rows = res.map(getRowDataAsObjects);
        rows.map(row => {
            const emailContent = emailContentFunction(row.problem, row.agent, row.task, row.organiser);
            const subject = subjectContentFunction(row.problem, row.agent, row.task, row.organiser);
            sendEmailTo(emailContent, subject, row.organiser.Email);
            callback(res, err);            
        });
    })
}

exports = module.exports = sendToOrganiser;