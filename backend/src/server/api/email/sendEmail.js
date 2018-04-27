// Title: sendEmail.js
// Author: Daniel Cooke 
// Date: 2018-04-14 15:54:00
const { spawn } = require('child_process');
const { exec } = require('child_process');

const mysql = require('mysql');
const connection = require('../../data/dbSettings');
const sendToAgents = require('./sendToAgents');
const sendToOrganiser = require('./sendToOrganiser');

/**
 * 
 * @param {Object} app the express app
 */
function sendEmail(app) {

    app.post('/api/email/agents/sendSurveys', (request, response) => {

        // Need email address of all agents
        const problemID = request.body['assignmentId'];
    

        sendSurveys(problemID, (res,err) => {

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

/**
 * makes a call to the sendToOrganiser module - sends the landing page link to the organiser of a problem
 * @param {string} problemID 
 * @param {Function} callback 
 */
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

/**
 * Makes a call to the sendToAgents module, sends survey links to all the agents belonging to a problemID
 * @param {string} problemID 
 * @param {Function} callback 
 */
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

/**
 * Makes a call to the sendToAgents module, sends assignment results to all the agents belonging to a proglem ID
 * @param {string} problemID 
 * @param {Function} callback 
 */
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