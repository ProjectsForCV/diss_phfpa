// Title: sendEmailTo.js
// Author: Daniel Cooke 
// Date: 2018-04-14 16:41:02

const { execFile, spawn } = require('child_process');

/**
 * spawns a child process postfix instance to which the email content is piped and sent.
 * @param {string} content email content
 * @param {string} subject email subject
 * @param {string} address to address
 */
function sendEmailTo(content, subject, address) {
    execFile(`printf`, [content], (err, out, stderr) => {
                 
        if (err) {
            throw err;
        }
        try {
           const mail = spawn('mail', ['-s', subject, '-r' ,'Assignment' , address]);
           mail.stdin.write(out); 
           mail.stdin.end();
        } catch(e) {
            console.error(e);
        }

    });
}

module.exports = exports = sendEmailTo;