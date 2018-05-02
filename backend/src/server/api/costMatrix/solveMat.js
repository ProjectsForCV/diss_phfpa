// Title: solveMat.js
// Author: Daniel Cooke 
// Date: 2018-04-14 16:22:30
const genetic = require('../../genetic/genetics');
const hungarian = require('../../hungarian/hungarian');
const {performance} = require('perf_hooks');
 /**
  * sets up the endpoint for the solve mat api
  * this api is used for solving cost matrices through the sub system - playground
  * @param {Object} - app - the express object
  */
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

                console.log(results);
                
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

/**
 * @typedef Task
 * @property {string} taskId
 * @property {string} taskName
 */
/**
 * @typedef Group
 * @property {Task[]} tasks
 * @property {number} maxAssignments
 */
/**
 * @typedef GeneticOptions
 * @property {number} maxGenerations
 * @property {number} mutationChance
 * @property {number} returnedCandidates
 * @property {number} populationSize
 * @property {number} distanceThreshold
 * @property {Group[]} groups
 */
/**
 * Makes a call to the genetic algorithm which Solves a 2-Dimensional cost matrix
 * @param {number[][]} mat 
 * @param {GeneticOptions} options 
 * @param {string[]} rownames 
 * @param {string[]} colnames 
 * @param {function} callback 
 */
function solveGenetically(mat, options, rownames, colnames, callback) {

    const start = performance.now();
    const results = genetic(mat, options, rownames, colnames);
    const end = performance.now();

    console.log(`Genetic Elapsed Time: ${end - start} `);
    
    if (results instanceof Error) {
        callback(undefined, 'The genetic algorithm failed');
        
    } else {
        callback(results, undefined);
    }

}

/**
 * Makes a call to the hungarian algorithm to solve a 2d cost matrix
 * @param {number[][]} mat 
 * @param {string[]} rownames 
 * @param {string[]} colnames 
 * @param {Function} callback 
 */
function solveHungarian(mat, rownames, colnames, callback) {

    const agents = rownames.map(name => {
        return {
            agentId: name,
            email: name
        };
    });
    
    const tasks = colnames.map(name => {
        return {
            taskId: name,
            taskName: name
        };
    });
    const results = new hungarian().minimise(mat, {
        tasks: tasks,
        agents: agents
    });

    callback(results, undefined);
    
}

exports = module.exports = solveMat;