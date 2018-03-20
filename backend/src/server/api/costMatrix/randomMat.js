const PythonShell = require('python-shell');
const PYTHON_PATH =  process.env.PYTHON_PATH;
function randomMat(app){
    app.get('/api/costMatrix/randomMat/:rows/:cols', (request, response) => {


        const rows = request.params['rows'];
        const cols = request.params['cols'];

        let options = {
            mode: 'json',
            pythonPath: PYTHON_PATH,
            scriptPath: 'python/assign',
            args: [rows, cols]
        };

        const shell = new PythonShell('random_mat.py', options);

        shell.on('message', (message) => {
            response.send(JSON.stringify(message))
            console.log(message)
        })

        shell.on('error', (err) =>{
            console.error(err);
        })
    });

}

exports = module.exports = randomMat;

