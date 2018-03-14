const formidable = require('formidable');
const PythonShell = require('python-shell');
const PYTHON_PATH =  process.env.PYTHON_PATH;
function checkCSV(app) {
    app.post('/api/email/checkCSV', (req, res) =>{

        const form = new formidable.IncomingForm();

        // Set this to indicate that you want to keep the original file extension
        form.keepExtensions = true;
        form.uploadDir = './tempData/';
        form.parse(req, (err, fields, files) =>{
            res.writeHead(200, {'Content-Type' : 'text/plain'});
            res.write('Received File\n');



            if (files && files['csv']){
                const file = files['csv'];
                const path = file.path;

                emailList = [];

                // TODO: Store this path in DATABASE - after it has been parsed and verified.
                let options = {
                    mode: 'text',
                    pythonPath: PYTHON_PATH,
                    scriptPath: './python/email/',
                    args: [path]
                };

                const shell = new PythonShell('parseCsv.py', options);

                shell.on('message', (message) => {
                    console.log(message);
                    emailList.push(message);
                });
                shell.end(() =>{
                    console.log(emailList);
                })
            }



        });


    })
}

exports = module.exports = checkCSV;