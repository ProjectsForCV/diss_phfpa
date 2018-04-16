// Title: solveProblem.js
// Author: Daniel Cooke 
// Date: 2018-04-14 16:29:21

const mysql = require('mysql');
const connection = require('../../data/dbSettings');
const geneticSolver = require('../../genetics');
const hungarian = require('../../hungarian');

 /**
  * sets up the endpoint for the solve problem api
  * this api is used for solving real-time assignment problems through the main system with real data
  * @param {Object} - app - the express object
  */
function solveProblem(app) {
    app.post('/api/costMatrix/solveProblem', (req, clientResponse) => {

        const completedAgents = req.body['agents'];
        const problemID = req.body['problemId'];
        const geneticOptions = req.body['geneticOptions'];

        const mat = completedAgents.map(agent => {

            return agent.answers.map(answer => {
                    return answer.cost
                });
            
        });

        switch(!!geneticOptions) {
            case false: {

                //
                //	HANDLE HUNGARIAN
                //
                
                startHungarian(mat, completedAgents, (agentTaskAssignment, error) => {
                    if (error) {
                        clientResponse.writeHead(500, {'Content-Type' : 'text/plain'});
                        clientResponse.end('Error: The assignment could not be solved, please try again later');
                        throw err;
                    }

                    clientResponse.json(agentTaskAssignment);
                    
                });

                break;
            }
            case true: {
                //
                //	HANDLE GENETIC
                //
                
                startGeneticSolver(completedAgents, geneticOptions, (results, error)=> {

                    if (error) {
                        clientResponse.writeHead(500, {'Content-Type' : 'text/plain'});
                        clientResponse.end('Error: The genetic algorithm failed.');
                        throw error;
                    }
                    clientResponse.json(results);
                });
                break;
            }
        }

    });
}
/**
 * @typedef SurveyAnswer
 * @property {number} answerId
 * @property {number} taskId
 * @property {number} taskName
 * @property {number} cost
 * 
 * 
 * 
 */
/**
 * @typedef Agent
 * @property {number} agentId
 * @property {string} email
 * @property {string} surveyID
 * @property {boolean} completed
 * @property {SurveyAnswer[]} answers
 */
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
 * Makes a call to the genetic algorithm which Solves a 2-Dimensional cost matrix using real agent data
 * @param {Agent[]} completedAgents 
 * @param {GeneticOptions} geneticOptions 
 * @param {function} callback 
 */
function startGeneticSolver(completedAgents, geneticOptions, callback) {
    const results = geneticSolver(completedAgents, geneticOptions)

    if (results === -1) {
        return callback(undefined, 'The genetic algorithm failed.');
    }

    return callback(results, undefined);

}

/**
 * Makes a call to the hungarin algorithm to solve a 2d cost matrix using real agent data
 * @param {number[][]} mat 
 * @param {Agent[]} completedAgents 
 * @param {Function} callback 
 */
function  startHungarian(mat, completedAgents, callback) {

  
    const rowNames = completedAgents.map(agent => agent.agentId);
    const colNames = completedAgents.map(agent => agent.answers.map(answer => answer.taskId))[0];
    const results = new hungarian().minimise(mat, {
        tasks: completedAgents[0].answers.map(ans => {
            return {
                taskId: ans.taskId,
                taskName: ans.taskName
            };
        }),
        agents: completedAgents
    });

    callback(results, undefined);

}




exports = module.exports = solveProblem;