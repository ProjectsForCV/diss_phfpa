// Title: server.js
// Author: Daniel Cooke 
// Date: 2018-04-14 15:54:30

const express = require('express');
const app = express();
const port = 12345;


//For POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, enctype');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


app.listen(port, (err) =>{

    if (err) {
        return console.log(err);
    }

    createEndpoints();

    console.log(`Server is listening on ${port}`);
});

/**
 * sets up endpoints using the express app
 */
function createEndpoints() {
    const randomMat = require('./api/costMatrix/randomMat');
    const solveMat = require('./api/costMatrix/solveMat');
    const solveProblem = require('./api/costMatrix/solveProblem');
    const csv = require('./api/csv/csv');
    const assignment = require('./api/assignment/assignment');
    const survey = require('./api/survey/survey');
    const email = require('./api/email/sendEmail');



    randomMat(app);
    solveMat(app);
    solveProblem(app);

    csv(app);

    assignment(app);
    survey(app);
    email(app);

}
