/***********************************************************************
 * Date: 01/12/2017
 * Author: Daniel Cooke
 ***********************************************************************/
// DCOOKE 01/12/2017 - TODO: This will need to be hosted on digital ocean for testing purposes
const express = require('express');
const app = express();
const port = 12345;


//For POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, enctype');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();


});

app.listen(port, (err) =>{

    if (err) {
        return console.log(err)
    }


    app.get('/', (req, res) => {
       console.log('Hit endpoint');
       res.send('Hello you have hit the endpoint \n');
    });
    createEndpoints();
    console.log(`server is listening on ${port}`)
});

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

// const sendEmail = require('./api/email/sendEmail');
// sendEmail({from:'wat',to:'dcooke06@qub.ac.uk',subject: 'Test', text: 'this is a test email'});