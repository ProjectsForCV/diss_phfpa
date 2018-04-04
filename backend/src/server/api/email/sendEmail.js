'use strict';
const nodemailer = require('nodemailer');

function sendEmail(app) {

    app.post('/api/email', (request, response) =>{

        // Need email address of all agents
        const agents = request.body;
        console.log(`${agents}`);
    })
    
    

}

module.exports = sendEmail;
