const {
    spawn
} = require('child_process');

const nodemailer = require('nodemailer');
const {
    exec
} = require('child_process');
const isEmail = require('validator/lib/isEmail');
const mysql = require('mysql');
const connection = require('../../data/dbSettings');
const sendToAgents = require('./sendToAgents');
const sendToOrganiser = require('./sendToOrganiser');

function sendEmail(app) {

    app.post('/api/email/agents/sendSurveys', (request, response) => {

        // Need email address of all agents
        const problemID = request.body['assignmentId'];
    

        sendSurveys(problemID, (err, res) => {

            if (err) {
                response.status(500).end();
            }else {
                response.status(200).end('Surveys sent to agents');
            }
        })
       

    })

    app.post('/api/email/agents/sendResults', (request, response) => {

        const problemID = request.body['assignmentId'];


        sendResults(problemID, (res, err) => {
            if (err) {

                response.status(500).end();
            } else {
                response.status(200).end('Results sent to agents');
            }
        });

       

    })

    app.post('/api/email/organiser/landingPage', (request, response) => {
       
        const problemID = request.body['assignmentId'];
        
        sendLandingPageToOrganiser(problemID, (res, err) => {

            if (err) {
                response.status(500).end();
            }else {
                response.status(200).end('Landing page sent to organiser');
            }
        })
    });

    
}


function sendLandingPageToOrganiser(problemID, callback) {

    sendToOrganiser(problemID, 
        (problem, agent, task, organiser) => {
            return `Hi, ${organiser.Name}!
            
            Your assignment has been created, you can view updates on the progress at the following link:

            https://munkres.ml/assignment/${problemID}

            Regards,
            munkres.ml

            `;

        },
        (problem, agent, task, organiser) => {
            return `Assignment Created`;
        },
        (res, err) => {

            callback(res, err);
        }
    );
}


function sendSurveys(problemID, callback) {


    sendToAgents(problemID, 

        (problem, agent, task, organiser) => {
            return `Dear ${problem.AgentAlias || 'Agent'}, 
            ${organiser.Name} has requested that you pick your favourite ${problem.TaskAlias || 'Task'} at the following link:
            \thttps://munkres.ml/survey/${agent.SurveyID} 
            \n\nRegards.\nmunkres.ml`;         
        },

        (problem, agent, task , organiser) => {
            return `Pick your ${problem.TaskAlias || 'Task'}`;
        },

        (res, err) => {

            callback(res,err);
        }
    );
    
}

function sendResults(problemID, callback) {

    sendToAgents(problemID, 
        (problem, agent, task, organiser) => {

            return `Dear ${problem.AgentAlias},
            \nYou have been assigned the following ${problem.TaskAlias || 'Task'}:\n\n\t\t
            ${task.Name}\n\n\nPlease direct any queries to your supervisor.\n\nRegards,\nmunkres.ml`;

        },
        (problem, agent, task, organiser) => {

            return `${problem.TaskAlias || 'Task'} Allocation`;
        },
        (res, err) => {

            callback(res,err);
        }
    );

}



module.exports = sendEmail;