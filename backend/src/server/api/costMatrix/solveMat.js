const { spawn } = require('child_process');
const genetic = require('../../genetics');
const { StringDecoder } = require('string_decoder');

function solveMat(app) {
    app.post('/api/costMatrix/solveMat', (req, res) => {

        const mat = req.body['matrix'];
        const geneticOptions = req.body['geneticOptions'];

        if (geneticOptions) {
            
            solveGenetically(mat, geneticOptions, (results, error) => {
                if (error) {

                    res.status(500).send(error);
                }

                res.json(results);
            })
        } else {

            let hungarianResults = [];
            solveHungarian(mat, (results, error, finished) => {
                if (error) {
                    res.status(500).send('The hungarian algorithm failed');
                    throw error;

                } 

                if (results) {
                    const decoder = new StringDecoder('utf-8');
                    let data = decoder.end(results);
                    let jsonData = [];
                    if (data) {
                         jsonData = JSON.parse(data);
                    }
                    
                    hungarianResults = hungarianResults.concat(jsonData);
                }
                if (finished) {
                    res.json(hungarianResults);
                }

                
    

            })
        }

     
    });
}

function solveGenetically(mat, options,  callback) {
    const results = genetic(mat,options);

    if (results !== -1) {
        callback(results, undefined);
    } 
    else {
        callback(undefined, 'The genetic algorithm failed');
    }

}
function solveHungarian(mat, callback) {
    const py = spawn('python', ['./python/assign/hungarian/hungarian.py', 
    JSON.stringify(mat)]);


    py.stdout.on('data', (data) => {
        callback(data, undefined, false);
    });

    py.stderr.on('err', (err) => {
       callback(undefined, err, false);
    });

    py.on('close', (code) => {
        
        console.log(`child process exited with code ${code}`);
        callback(undefined, undefined, true);
    });
}

exports = module.exports = solveMat;