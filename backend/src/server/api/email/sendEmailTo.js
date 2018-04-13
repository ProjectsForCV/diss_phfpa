const { execFile, spawn } = require('child_process');

function sendEmailTo(content, subject, address) {
    execFile(`printf`, [content], (err, out, stderr) => {
                 
        if (err) {
            throw err;
        }
        try {
           const mail = spawn('mail', ['-s', `${subject}`, `${address}`, '-r' ,'assignment']);
           mail.stdin.write(out);
           mail.stdin.end();
        } catch(e) {
            console.error(e);
        }

    });
}

module.exports = exports = sendEmailTo;