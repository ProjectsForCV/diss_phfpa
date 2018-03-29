/***********************************************************************
 * Date: 29/03/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
    parseEmail.js is called by the client to return a list of valid emails contained within a CSV
 */
/* ================================================================================================================== */
/*  IMPORTS -   29/03/2018  -   DCOOKE
/* ================================================================================================================== */
const formidable = require('formidable');
const parse = require('csv-parse');
const fs = require('fs');
let response;
/* ================================================================================================================== */
/*  FUNCTIONS -   29/03/2018  -   DCOOKE
/* ================================================================================================================== */
/*
 DCOOKE 29/03/2018 - parseEmail sets up the main post endpoint for the frontend to call
 */
function parseEmail(app) {
    app.post('/api/csv/parseEmail', (req, res) =>{

        response = res;
        getFormData(req, readCSV);


    })
}

/*
 DCOOKE 29/03/2018 - getFormData uses formidable to read FormData, it stores files temporarily then deletes them
 */
function getFormData(req, readCSV ) {
    const form = new formidable.IncomingForm();

    // Set this to indicate that you want to keep the original file extension
    form.keepExtensions = true;
    form.uploadDir = './tempData/';

    form.parse(req, readCSV)
}



/*
 DCOOKE 29/03/2018 - readCSV is used as the callback to getFormData, it receives the files uploaded ie. the email CSV
 */
function readCSV(err, fields, files) {
    if (files && files['csv']){
        const file = files['csv'];
        const path = file.path;


        fs.readFile(path, 'utf-8', (err, data)=>{

            if (err) {
                return null;

            }
            else {


                parse(data, {relax_column_count: true},(err, out) =>{
                    // flatten 2d array into 1d array
                    items = [].concat.apply([], out);
                    emailList = items.filter((item) => item.includes('@'));
                    emailList = emailList.map(email => email.trim());

                    if(emailList && emailList.length > 0){

                        response.json({
                            emails : emailList
                        })

                    }

                })

                // Delete temp file
                fs.unlink(path);
            }


        })

    }
}



exports = module.exports = parseEmail;


