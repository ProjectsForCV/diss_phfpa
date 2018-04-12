const {
    spawn
} = require('child_process');
const {
    execFile
} = require('child_process');
const nodemailer = require('nodemailer');
const {
    exec
} = require('child_process');
const isEmail = require('validator/lib/isEmail');
const mysql = require('mysql');
const connection = require('../../data/dbSettings');

function sendEmail(app) {

    app.post('/api/email/agents/sendSurveys', (request, response) => {

        // Need email address of all agents
        const problemID = request.body['assignmentId'];
    

        sendSurveys(problemID, (err, res) => {

            if (err) {
                throw err;
            }

            response.status(200).end('Emails sent.');
        })
       

    })

    app.post('/api/email/agents/sendResults', (request, response) => {

        const problemID = request.body['assignmentId'];


        sendResults(problemID, (res, err) => {
            if (err) {

                response.status(500).end('Something bad happened');

            }
        });

       

    })

    app.post('/api/email/organiser/landingPage', (request, response) => {
       
        const problemID = request.body['assignmentId'];
        const db = mysql.createConnection(connection);

        db.query(`
                SELECT * FROM problems
                JOIN (organisers) ON 
                problems.ProblemID = ?
                and problems.OrganiserID = organisers.OrganiserID

        `, problemID, (err, res) => {
            if (err) {
                response.status(500).end('And error occurred');
                throw err;
            }

            const organiser = res[0];
            const emailContent = `Hey ${organiser.Name}!
            \nYour assignment problem has been created.\nYou can track the progress of the problem at the following link:
            \n\nhttps://munkres.ml/assignment/${problemID}\n\nRegards,\nmunkres.ml
            `;

            execFile(`printf`, [emailContent], (err, out, stderr) => {

                if (err) {
                    throw err;
                }
                const mail = spawn('mail', ['-s', `${organiser.taskAlias} Allocation`, `${organiser.Email}`, '-r', 'munk@munkres.support.ml']);
                mail.stdin.write(out);
                mail.stdin.end();


                response.status(200).end();
            });

        });
    });
}

function sendSurveys(problemID, callback) {

    const db = mysql.createConnection(connection);
    db.query(`SELECT problems.TaskAlias, organisers.Name, problems.AgentAlias, agents.Email, problem_agents.SurveyID
    FROM problems
    JOIN (problem_agents, agents, organisers)
    ON problems.ProblemID = ?
    AND problem_agents.ProblemID = problems.ProblemID
    AND agents.AgentID = problem_agents.AgentId
    AND organisers.OrganiserID = problems.OrganiserID` , problemID, (err,res) => {

        res.map(
            assignment => {
                const emailContent = `Dear ${assignment.AgentAlias || 'Agent'}, \n${assignment.Name} has requested that you pick your favourite ${assignment.TaskAlias || 'Task'} at the following link:\n\n \thttps://munkres.ml/survey/${assignment.SurveyID} \n\nRegards.\nmunkres.ml
                `;
         
         
                 execFile(`printf`, [emailContent], (err, out, stderr) => {
         
                     if (err) {
                         throw err;
                     }
                     const mail = spawn('mail', ['-s', `${assignment.Name}`, `${assignment.Email}`, 'munk@munkres.support.ml']);
                     mail.stdin.write(out);
                     mail.stdin.end();
        
         
         
                 });
            }
        );

        callback(undefined, res);
    });
}

function sendResults(problemID, callback) {
    const db = mysql.createConnection(connection);

    const getAssignmentResults = require('../assignment/getAssignmentResults');

    getAssignmentResults(problemID, (err, res) => {
        if (err) {
            callback(null, err);
        }

        res.map(assignment => {

            const emailContent = `Dear ${assignment.AgentAlias},
            \nYou have been assigned the following ${assignment.TaskAlias}:\n\n\t\t
            ${assignment.Name}\n\n\nPlease direct any queries to your supervisor.\n\nRegards,\nmunkres.ml`;

            execFile(`printf`, [emailContent], (err, out, stderr) => {

                if (err) {
                    throw err;
                }
                const mail = spawn('mail', ['-s', `${assignment.TaskAlias} Allocation`, `${assignment.Email}`, '-r', 'munk@munkres.support.ml']);
                mail.stdin.write(out);
                mail.stdin.end();


            });
        })
    });

}

module.exports = sendEmail;