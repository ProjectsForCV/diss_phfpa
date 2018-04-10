const { spawn } = require('child_process');

const { execFile } = require('child_process');

'use strict';
const nodemailer = require('nodemailer');
const { exec } = require('child_process');
const isEmail = require('validator/lib/isEmail');

function sendEmail(app) {

    app.post('/api/email/agents', (request, response) =>{

        // Need email address of all agents
        const agents = request.body['agents'];
        const taskAlias  = request.body['taskAlias'] || 'Task';
        const agentAlias  = request.body['agentAlias'] || 'Agent';
        const organiserName  = request.body['organiserName'] || 'Organiser';

        for (let i = 0; i < agents.length; i++) {
           if (!isEmail(agents[i].email)){
                continue;
           }
           const emailContent = `Dear ${agentAlias}, \n${organiserName} has requested that you pick your favourite ${taskAlias} at the following link:\n\n \thttps://munkres.ml/survey/${agents[i].surveyId}. \n\nRegards.\nmunkres.ml
           `;


           execFile(`printf`,[emailContent], (err, out, stderr) => {

            if (err) {
                throw err;
            }
            const mail = spawn('mail',  ['-s',`Pick your ${taskAlias}`,`${agents[i].email}`,'munk@munkres.support.ml']);
            mail.stdin.write(out);
            mail.stdin.end();

            mail.stdin.on('data' , (data) => {
                console.log(`Mail command received stdin: ${data}`);
            
            })
            mail.stderr.on('err', (err) => {
                console.error(err);
                throw err;
            })

            //what
            
            
           });
        }
        
    })
    
    

}

module.exports = sendEmail;
