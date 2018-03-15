const formidable = require('formidable');
const parse = require('csv-parse');
const fs = require('fs');

function parseEmail(app) {
    app.post('/api/csv/parseEmail', (req, res) =>{

        const form = new formidable.IncomingForm();

        // Set this to indicate that you want to keep the original file extension
        form.keepExtensions = true;
        form.uploadDir = './tempData/';
        form.parse(req, (err, fields, files) =>{


            if (files && files['csv']){
                const file = files['csv'];
                const path = file.path;

                let emailList = [];

                fs.readFile(path, 'utf-8', (err, data)=>{

                    if (err) {
                        res.writeHead(500, {'Content-Type' : 'text/plain'});
                        res.write(`${file.name} is incorrectly formatted. Please make sure the .csv contains comma-separated values.\n`);

                    }
                    else {
                        parse(data, {relax_column_count: true},(err, out) =>{
                            // flatten 2d array into 1d array
                            items = [].concat.apply([], out);
                            emailList = items.filter((item) => item.includes('@'));
                            emailList = emailList.map(email => email.trim());

                            if(emailList && emailList.length > 0){

                                res.json({
                                    emails : emailList
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

exports = module.exports = parseEmail;