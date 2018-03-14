const { spawn } = require('child_process');

function solveMat(app) {
    app.post('/api/costMatrix/solveMat', (req, res) => {

        const mat = req.body;

        const py = spawn('python', ['./python/assign/hungarian/hungarian.py', JSON.stringify(mat)]);


        py.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            res.writeHead(200, {'Content-Type': 'text/json'});


            res.end(data);
        });

        py.stderr.on('data', (data) => {


        });

        py.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    });
}

exports = module.exports = solveMat;