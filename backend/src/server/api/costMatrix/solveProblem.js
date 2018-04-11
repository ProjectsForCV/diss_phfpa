const mysql = require('mysql');
const connection = require('../../data/dbSettings');
const geneticSolver = require('../../genetics');
const hungarian = require('../../hungarian');

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

function handleHungarian(matrix, completedAgents, callback) {}
function startGeneticSolver(completedAgents, geneticOptions, callback) {
    const results = geneticSolver(completedAgents, geneticOptions)

    if (results === -1) {
        return callback(undefined, 'The genetic algorithm failed.');
    }

    return callback(results, undefined);

}
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