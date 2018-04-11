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
                    addCompletedAssignmentToDatabase(problemID, agentTaskAssignment, (err) => {
        
                        if (err) {
                            clientResponse.writeHead(500, {'Content-Type' : 'text/plain'});
                            clientResponse.end('Error: The assignment could not be solved, please try again later');
                            throw err;
                        }
            
            
                            clientResponse.status(200).end();
                    });
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
        rownames: rowNames,
        colnames: colNames
    });

    callback(results, undefined);

}

function addCompletedAssignmentToDatabase(problemID, agentTaskAssignment , callback) {

    const db = mysql.createConnection(connection);
    const agentIDs = agentTaskAssignment.map(pair => pair.agentId)
    const taskIDs = agentTaskAssignment.map(pair => pair.taskId)
    const insert = agentIDs.map(
        (agentId, index) => {

            return [problemID, agentId, taskIDs[index]]
        }
    )

    db.beginTransaction((err) => {

        db.query("INSERT INTO assignments(ProblemID, AgentID, TaskID) VALUES ?", 
        [insert], (err, res) => {
    
            // Update Problems table
            db.query("UPDATE problems SET Finished = 1 WHERE ProblemID = ? ", problemID, (err, res) => {
                
                if (err) {
                    throw err;
                }
                
                db.commit((err) => {
                    callback(err);
                })

            });
        });
    })

    

}


exports = module.exports = solveProblem;