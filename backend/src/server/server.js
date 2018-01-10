/***********************************************************************
 * Date: 01/12/2017
 * Author: Daniel Cooke
 ***********************************************************************/
// DCOOKE 01/12/2017 - TODO: This will need to be hosted on digital ocean for testing purposes
const express = require('express');
const app = express();
const port = 12345;

const PythonShell = require('python-shell');


app.get('/randomMat', (request, response) => {

    let options = {
        mode: 'json',
        scriptPath: '../assign/',
        args: [5, 5]
    };

    const shell = new PythonShell('random_mat.py', options);

    shell.on('message', (message) => {
        response.send(JSON.stringify(message))
        console.log(message)
    })


});


app.listen(port, (err) =>{

    if (err) {
        return console.log(err)
    }

    console.log(`server is listening on ${port}`)
});
