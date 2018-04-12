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
        const agents = request.body['agents'];
        const taskAlias = request.body['taskAlias'] || 'Task';
        const agentAlias = request.body['agentAlias'] || 'Agent';
        const organiserName = request.body['organiserName'] || 'Organiser';

        for (let i = 0; i < agents.length; i++) {
            if (!isEmail(agents[i].email)) {
                continue;
            }
            const emailContent = `Dear ${agentAlias}, \n${organiserName} has requested that you pick your favourite ${taskAlias} at the following link:\n\n \thttps://munkres.ml/survey/${agents[i].surveyId}. \n\nRegards.\nmunkres.ml
           `;


            execFile(`printf`, [emailContent], (err, out, stderr) => {

                if (err) {
                    throw err;
                }
                const mail = spawn('mail', ['-s', `Pick your ${taskAlias}`, `${agents[i].email}`, 'munk@munkres.support.ml']);
                mail.stdin.write(out);
                mail.stdin.end();

                mail.stdin.on('data', (data) => {
                    console.log(`Mail command received stdin: ${data}`);

                })
                mail.stderr.on('err', (err) => {
                    console.error(err);
                    throw err;
                })


            });
        }

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


            });

        });
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

            const emailContent = `Dear ${assignment.agentAlias},
            \nYou have been assigned the following ${assignment.taskAlias}:\n\n\t\t
            ${assignment.Name}\n\n\nPlease direct any queries to your supervisor.\n\nRegards,\nmunkres.ml`;

            execFile(`printf`, [emailContent], (err, out, stderr) => {

                if (err) {
                    throw err;
                }
                const mail = spawn('mail', ['-s', `${assignment.taskAlias} Allocation`, `${assignment.Email}`, '-r', 'munk@munkres.support.ml']);
                mail.stdin.write(out);
                mail.stdin.end();


            });
        })
    });

}

module.exports = sendEmail;