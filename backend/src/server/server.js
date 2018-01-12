/***********************************************************************
 * Date: 01/12/2017
 * Author: Daniel Cooke
 ***********************************************************************/
// DCOOKE 01/12/2017 - TODO: This will need to be hosted on digital ocean for testing purposes
const express = require('express');
const app = express();
const port = 12345;
const { spawn } = require('child_process');
const PythonShell = require('python-shell');

const PYTHON_PATH =  process.env.PYTHON_PATH;

//For POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();


});

app.get('/api/randomMat/:rows/:cols', (request, response) => {

    const rows = request.params['rows'];
    const cols = request.params['cols'];

    let options = {
        mode: 'json',
        pythonPath: PYTHON_PATH,
        scriptPath: '../assign/',
        args: [rows, cols]
    };

    const shell = new PythonShell('random_mat.py', options);

    shell.on('message', (message) => {
        response.send(JSON.stringify(message))
        console.log(message)
    })


});

app.post('/api/solveMat', (req, res) => {

    const mat = req.body;

    const py = spawn('python', ['../assign/hungarian/hungarian.py', JSON.stringify(mat)]);


    py.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        res.writeHead(200, {'Content-Type': 'text/json'});


        res.end(data);
    });

    py.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);

    });

    py.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });



});


app.listen(port, (err) =>{

    if (err) {
        return console.log(err)
    }

    console.log(`server is listening on ${port}`)
});
