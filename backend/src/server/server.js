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

    createEndpoints();
    console.log(`server is listening on ${port}`)
});

function createEndpoints() {
    const randomMat = require('./api/costMatrix/randomMat');
    const solveMat = require('./api/costMatrix/solveMat');
    const parseEmail  = require('./api/csv/parseEmail');
    const parseTask = require('./api/csv/parseTask');

    randomMat(app);
    solveMat(app);

    parseEmail(app);
    parseTask(app);

}