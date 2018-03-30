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
function parseTask(app) {

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


}

exports = module.exports = parseTask;