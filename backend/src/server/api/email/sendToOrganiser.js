// Title: sendToOrganiser.js
// Author: Daniel Cooke 
// Date: 2018-04-14 16:55:07
const mysql = require('mysql');
const connection = require('../../data/dbSettings');
const sendEmailTo = require('./sendEmailTo');
const getRowDataAsObjects = require('./getRowDataAsObjects');

/**
 * Sends an email to the organiser that belongs to the provided problemID
 * @param {string} problemID
 * @param {(problem, agent, task ,organiser) => string} emailContentFunction  
 * @param {(problem, agent, task ,organiser) => string}  subjectContentFunction  
 * @param {(err, res) => } callback
 */
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