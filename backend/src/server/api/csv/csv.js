/***********************************************************************
 * Date: 29/03/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 29/03/2018 - parseTask.js is used to parse csv
 */
/* ================================================================================================================== */
/*  IMPORTS -   29/03/2018  -   DCOOKE
/* ================================================================================================================== */
const formidable = require('formidable');
const parse = require('csv-parse');
const fs = require('fs');

/*
 DCOOKE 29/03/2018 - parseTask is used to setup the endpoint and parse task csv
 */
function csv(app) {

    app.post('/api/csv/parseTask', (req, res) =>{

        const form = new formidable.IncomingForm();

        // Set this to indicate that you want to keep the original file extension
        form.keepExtensions = true;
        form.uploadDir = './tempData/';
        form.parse(req, (err, fields, files) =>{


            if (files && files['csv']){
                const file = files['csv'];
                const path = file.path;

                fs.readFile(path, 'utf-8', (err, data)=>{

                    if (err) {
                        res.writeHead(500, {'Content-Type' : 'text/plain'});
                        res.write(`${file.name} is incorrectly formatted. Please make sure the .csv contains comma-separated values.\n`);

                    }
                    else {
                        parse(data, {relax_column_count: true},(err, out) =>{
                            // flatten 2d array into 1d array
                            items = [].concat.apply([], out);

                            items = items.filter(n => n !== '' && n !== undefined);

                            tasksFilteredForLength = items.filter(item => item.length < 50);
                            const tasksRemoved = tasksFilteredForLength.length !== items.length;

                            console.log(`Tasks Removed: ${tasksRemoved}`);
                            if(items && items.length > 0){

                                res.json({
                                    tasks : tasksFilteredForLength,
                                    tasksRemoved: tasksRemoved
                                })

                            }

                        })

                    }

                    fs.unlink(path);
                })

            }



        });


    })

    app.post('/api/csv/parseEmail', (req, res) =>{

        response = res;
        getFormData(req, readCSV);
    })

    app.post('/api/csv/costMatrix' , (req, res) => {

        const form = new formidable.IncomingForm();

        form.keepExtensions = true;
        form.uploadDir = './tempData/';

        form.parse(req, (err, fields, files) => {
            if (files && files['csv']){
                const file = files['csv'];
                const path = file.path;
    
                fs.readFile(path, 'utf-8', (err, data)=>{
    
                    if (err) {
                        return null;
        
                    }
                    else {
        
        
                        parse(data,(err, out) =>{
                            // flatten 2d array into 1d array
                          const response = out.map(row => row.map(col => parseInt(col,10)));
                          res.json(response);
                          
                        });
        
                        // Delete temp file
                        fs.unlink(path);
                    }
        
        
                })
            }
        })
        
        
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
                    emaliListFilteredForLength = emailList.filter(email => email.length < 50);

                    const emailsRemovedDueToLength = emaliListFilteredForLength.length !== emailList.length;

                    emailList = emaliListFilteredForLength.map(email => email.trim());

                    if(emailList && emailList.length > 0){

                        response.json({
                            emails : emailList,
                            emailsRemoved: emailsRemovedDueToLength
                        })

                    }

                });

                // Delete temp file
                fs.unlink(path);
            }


        })

    }
}



exports = module.exports = csv;