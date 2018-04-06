const { spawn } = require('child_process');
const { StringDecoder } = require('string_decoder');
const mysql = require('mysql');
const connection = require('../../data/dbSettings');
const geneticSolver = require('../../genetics');

function solveProblem(app) {
    app.post('/api/costMatrix/solveProblem', (req, clientResponse) => {

        
        const completedAgents = req.body['agents'];
        const problemID = req.body['problemId'];
        const geneticOptions = req.body['geneticOptions'];

        const mat = completedAgents.map(agent => {
            return agent.answers.map(answer => {
                    return answer.cost
                })
            
        })

        switch(!!geneticOptions) {
            case false: {
                startHungarian(mat, completedAgents, (agentTaskAssignment, error) => {
                    if (err) {
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
                })
            }
            case true: {
                startGeneticSolver(completedAgents, geneticOptions, (results, error)=> {

                })
            }
        }
        



        
    });
}

function startGeneticSolver(completedAgents, geneticOptions, callback) {
    const results = geneticSolver(completedAgents, geneticOptions)

}
function  startHungarian(mat, completedAgents, callback) {

    const py = spawn('python', ['./python/assign/hungarian/hungarian.py', 
    JSON.stringify(mat),
    completedAgents.map(agent => agent.agentId).join(),
    completedAgents.map(agent => agent.answers.map(answer => answer.taskId).join())[0]])

    py.stdout.on('data', (data) => {
         // Return decoded output
         callback(decodeHungarianOutput(data), undefined);
    });

    py.stderr.on('err', (err) => {
        // Return error
        callback(undefined, err);
    });

    py.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

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

function decodeHungarianOutput(stdout) {
    const decoder = new StringDecoder('utf-8');
    let data = decoder.end(stdout);
    data = data.split('\n').filter(entry => entry !== "");
    return data.map(pair => pair.split('\t')).map(row => {return {
        agentId: parseInt(row[0],10),
        taskId: parseInt(row[1],10)
    }});
}
exports = module.exports = solveProblem;