const genetic = require('../../genetics');
const hungarian = require('../../hungarian');

function solveMat(app) {
    app.post('/api/costMatrix/solveMat', (req, res) => {

        const mat = req.body.matrix;
        const rownames = req.body.rownames;
        const colnames = req.body.colnames;
        const geneticOptions = req.body.geneticOptions;

        if (geneticOptions) {

            solveGenetically(mat, geneticOptions, rownames, colnames , (results, error) => {
                if (error) {

                    res.status(500).send(error);
                }

                res.json(results);
            });

        } else {

            solveHungarian(mat, rownames, colnames, (results, error) => {
                if (error) {

                    res.status(500).send('The hungarian algorithm failed');
                    throw error;

                } else {

                    res.json(results);
                }
            });
        }


    });
}

function solveGenetically(mat, options, rownames, colnames, callback) {
    const results = genetic(mat, options, rownames, colnames);

    if (results !== -1) {
        callback(results, undefined);
    } else {
        callback(undefined, 'The genetic algorithm failed');
    }

}

function solveHungarian(mat, rownames, colnames, callback) {

    const agents = rownames.map(name => {
        return {
            agentId: name,
            email: name
        }
    })
    
    const tasks = colnames.map(name => {
        return {
            taskId: name,
            taskName: name
        }
    })
    const results = new hungarian().minimise(mat, {
        tasks: tasks,
        agents: agents
    });

    callback(results, undefined);
    
}

exports = module.exports = solveMat;