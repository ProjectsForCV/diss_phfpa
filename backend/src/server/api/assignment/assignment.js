// Title: assignment.js
// Author: Daniel Cooke 
// Date: 2018-04-14 16:36:51

const mysql = require('mysql');
const fs = require('fs');
const connection = require('../../data/dbSettings');
const uuid = require('uuid/v4');
const getAssignmentResults = require('./getAssignmentResults');
const isEmail = require('validator/lib/isEmail');


/**
 * This module handles requests made to the assignment api
 * 
 * @module assignment
 * @function assignmentObject
 * @param {Object} app
 */
function assignmentObject(app) {

    app.post('/api/assignment', (req, clientResponse) => {

        const assignment = req.body;
        
        let invalidEmailCount = 0;
        for (let i = 0 ; i < assignment.agents.length; i++) {
            if (!isEmail(assignment.agents[i].email)) {
                invalidEmailCount ++;
            }
        }

        if (invalidEmailCount > 0) {
            clientResponse.status(500).end('Invalid Email provided');
        }
        
        if (assignment.image) {
            assignment.image = saveImageData(assignment.image);
        }
        
        createAssignmentProblem(assignment, clientResponse);

    });

    app.post('/api/assignment/finish', (req, clientResponse) => {

        const problemID = req.body.assignmentId;
        const solution = req.body.solution;

        addCompletedAssignmentToDatabase(problemID, solution, (err) => {

            if (err) {
                clientResponse.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                clientResponse.end('Error: The assignment could not be solved, please try again later');
                throw err;
            }


            clientResponse.status(200).end();
        });
    });

    app.get('/api/assignment', (req, clientResponse) => {

        let assignment = {
            assignmentId: req.query.assignmentId
        };
        getAssignmentProblem(assignment, clientResponse);
    });

    app.get('/api/assignment/results', (req, clientResponse) => {

        const problemID = req.query.assignmentId;
        const db = mysql.createConnection(connection);
        getAssignmentResults(problemID, (err, res) => {

            if (err) {
                clientResponse.status(500).send('An error occured when fetching the results');
                throw err;
            }


            clientResponse.json(res.map(row => {
                return {
                    agent: {
                        email: row.Email
                    },
                    task: {
                        taskName: row.Name
                    },
                    cost: row.Cost

                }
            }));


        })
    })



}

function getImageDataURL(path) {
    if (!path ) {
        return;
    }
    const mime = require('mime-types');
    const ext = path.split('.').pop();
    const mimeType = mime.lookup(ext);
    const data = fs.readFileSync(path,{encoding :'base64'});
    const base64 = `data:${mimeType};base64,${data}`;
    return base64;
}
function saveImageData(base64ImageString) {
    
    const base64 = base64ImageString;
    const mime = require('mime-types');

    const mimeType = base64.substring(5,base64.indexOf(';'));
    const ext = mime.extension(mimeType);
    const data = base64.split(',').pop();
    const buffer = new Buffer(data, 'base64');
    const path = `images/${uuid() + '.' + ext}`;
    
    try {
        fs.writeFileSync(path, buffer);
    } catch (e) {
        console.log('Image not saved');
        console.error(e);
    }

    return path;
    
}
/*
 DCOOKE 29/03/2018 - rollback is used to undo an ongoing SQL Transaction in the case of an error - this way the database
                     integrity is protected.
 */
function rollback(db, error, query) {
    db.rollback(() => {

        console.error('ERROR WITH QUERY: ' + query);
        throw error;
    })
}

/*
 DCOOKE 29/03/2018 - createAssignmentProblem is used to add a new assignment problem to the database, it takes place
                     in stages. If one stage fails the transaction is rolled back.
 */
function createAssignmentProblem(assignment, clientRes) {

    const db = mysql.createConnection(connection);

    db.connect();




    db.beginTransaction((err) => {
        if (err) {
            throw err;
        }

        const problemID = uuid();

        insertTasks(db, problemID, assignment, (insertedTaskIDs, error) => {

            if (error) {
                rollback(db, error);
            }

            insertOrganiser(db, assignment, (insertedOrganiserID, error) => {

                if (error) {
                    rollback(db, error);
                }

                insertProblem(db, problemID, insertedOrganiserID, assignment, (insertResults, error) => {

                    insertAgents(db, assignment, (insertedAgentIDs, error) => {

                        if (error) {
                            rollback(db, error);
                        }

                        insertProblemAgents(db, problemID, insertedAgentIDs, (results, error) => {

                            if (error) {
                                rollback(db, error);
                            }

                            insertProblemTasks(db, problemID, insertedTaskIDs, (results, error) => {

                                if (error) {
                                    rollback(db, error);
                                }

                                db.commit((err) => {

                                    if (err) {
                                        rollback(db, err);
                                    }

                                    console.log(`Assignment : ${assignment.assignmentTitle} added to database. Successfully`);


                                    ret = {
                                        problemId: problemID
                                    };

                                    clientRes.json(ret);
                                })
                            })
                        })

                    })
                })


            })


        })



        // Insert surveys



    });
}

function insertProblemTasks(databaseConnection, problemID, insertedTaskIDs, callback) {

    const db = databaseConnection;
    const problemTasks = Array.from(insertedTaskIDs, id => [problemID, id])

    let q = db.query('INSERT INTO problem_tasks(ProblemID, TaskID) VALUES ?', [problemTasks], (err, res) => {

        if (err) {
            callback(undefined, err);
        }

        callback(res, undefined);
    });


}

function insertProblemAgents(databaseConnection, problemID, insertedAgentIDs, callback) {
    const db = databaseConnection;
    // Insert Problem agents
    const problemAgents = Array.from(insertedAgentIDs, (id, index) => {
        return [problemID, id, uuid()];
    })
    let q2 = db.query(`INSERT INTO problem_agents(ProblemID, AgentID, SurveyID) VALUES ?`, [problemAgents], (err, res) => {

        if (err) {
            callback(undefined, err);
        }

        callback(res, undefined);
    })


}

function insertAgents(databaseConnection, assignment, callback) {
    const db = databaseConnection;
    const agentEmails = assignment.agents.map(agent => [agent.email]);

    db.query("INSERT INTO agents(Email) VALUES ?", [agentEmails], (err, res) => {
        if (err) {
            callback(undefined, err);
        }

        const insertedAgentIDs = getInsertedIDs(res);

        callback(insertedAgentIDs, undefined);
    })


}

function insertProblem(databaseConnection, problemID, organiserID, assignmentObject, callback) {

    const db = databaseConnection;
    
    const insertData = [
        problemID,
        assignmentObject.assignmentTitle,
        organiserID,
        assignmentObject.taskAlias,
        assignmentObject.agentAlias,
        assignmentObject.surveyOptions.maxSelection || 0,
        assignmentObject.surveyOptions.allowOptOut,
        assignmentObject.surveyOptions.message,
        assignmentObject.surveyOptions.maxOptOut || 0,
        assignmentObject.image
    ]
    let problemQuery = db.query(`INSERT INTO problems(
        ProblemID, 
        Name, 
        OrganiserID, 
        TaskAlias, 
        AgentAlias, 
        MaxSelection, 
        AllowOptOut, 
        MessageForAgents, 
        OptOutMax,
        ImageURL
    ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, insertData, (err, res) => {

        if (err) {
            callback(undefined, err);
        }

        callback(res, undefined);

    });
}

function insertOrganiser(databaseConnection, assignmentObject, callback) {

    const db = databaseConnection;

    const organiser = [assignmentObject.organiserName, assignmentObject.organiserEmail];

    // Create organiser
    let query = db.query('INSERT INTO organisers(Name, Email) VALUES (?, ?)', organiser, (err, res) => {

        if (err) {
            callback(undefined, err);
        }

        callback(res.insertId);
    });
}

function insertTasks(databaseConnection, problemID, assignmentObject, callback) {

    const db = databaseConnection;
    const assignment = assignmentObject;

    const tasks = assignment.tasks.map((val, index) => {
        let taskArray = [];
        taskArray.push(val);
        return taskArray;
    });


    // Create Tasks
    let taskQuery = db.query('INSERT INTO tasks(Name) VALUES ?', [tasks], (error, results) => {

        if (error) {
            callback(undefined, error);
        }


        const insertedIDs = getInsertedIDs(results);

        callback(insertedIDs, undefined)
    });
}

// DCOOKE - Gets the inserted IDs from an insert command    
function getInsertedIDs(insertQueryResults) {
    const numberOfInsertedRows = insertQueryResults.affectedRows;
    return Array.from({
        length: numberOfInsertedRows
    }, (val, index) => {
        return index + insertQueryResults.insertId;
    })
}

function getAssignmentProblem(assignment, clientResponseStream) {



    const db = mysql.createConnection(connection);

    let responseObject = assignment;

    getProblemDetails(db, assignment.assignmentId, (problemDetails, error) => {

        if (error) {
            handleError(error, clientResponseStream)
        }

        // Add problem details to response
        responseObject = Object.assign(responseObject, problemDetails);

        getOrganiserDetails(db, responseObject.organiserId, (organiserDetails, error) => {

            if (error) {
                handleError(error, clientResponseStream);
            }

            // Add organiser detals to response
            responseObject = Object.assign(responseObject, organiserDetails);

            const getAgentDetails = require('./getAgentDetails');
            getAgentDetails(db, responseObject.assignmentId, (agentDetails, error) => {

                if (error) {
                    handleError(error, clientResponseStream);
                }

                // Add agent details to response
                responseObject.agents = agentDetails;

                // Create list of agents that have completed their surveys
                const completedAgents = assignment.agents.filter(agent => agent.completed);

                // If some agents have completed their surveys, get the answers that they gave
                if (completedAgents && completedAgents.length > 0) {


                    getSurveyAnswers(db, completedAgents, (answers, error) => {
                        const completedSurveyAnswers = answers;


                        clientResponseStream.json(responseObject)


                    });


                } else {
                    // Otherwise return the response object as is
                    clientResponseStream.json(responseObject);
                }
            })
        })

    })
}




function getOrganiserDetails(databaseConnection, organiserID, callback) {

    const db = databaseConnection;

    db.query(`SELECT * FROM organisers WHERE OrganiserID =?`, organiserID, (err, res) => {

        if (err) {
            callback(undefined, err);
        }

        // Assume 1 row returned
        const data = res[0];

        const organiserDetails = {};
        organiserDetails.organiserName = data.Name;
        organiserDetails.organiserEmail = data.Email;

        callback(organiserDetails, undefined);


    })

}

function getProblemDetails(databaseConnection, problemID, callback) {

    const db = databaseConnection;

    db.query(`
    SELECT * FROM problems WHERE ProblemID=?`, problemID, (err, res) => {


        if (err) {
            callback(undefined, err)
        }

        // will always return 1 row
        data = res[0];

        //
        //	ADD ASSIGNMENT TITLE, ORGANISER ID, TASK ALIAS AND AGENT ALIAS TO ASSIGNMENT OBJECT
        //

        const problemDetails = {};
        problemDetails.assignmentTitle = data.Name;
        problemDetails.organiserId = data.OrganiserID;
        problemDetails.taskAlias = data.TaskAlias;
        problemDetails.agentAlias = data.AgentAlias;
        problemDetails.surveyOptions = {};
        problemDetails.surveyOptions.maxSelection = data.MaxSelection;
        problemDetails.surveyOptions.allowOptOut = data.AllowOptOut;
        problemDetails.finished = data.Finished;
        problemDetails.image = getImageDataURL(data.ImageURL)

        db.query(`SELECT tasks.TaskID, Name from tasks
        join problem_tasks
        WHERE tasks.TaskID = problem_tasks.TaskID
        and problem_tasks.ProblemID = ?`, problemID, (err, res) => {

            if (err) {
                callback(unedfined, err)
            }

            const tasks = res.map(row => {
                return {
                    taskId: row.TaskID,
                    taskName: row.Name
                }
            })
            problemDetails.tasks = tasks;
            callback(problemDetails, undefined);
        })




    })
}

function getSurveyAnswers(databaseConnection, agentsThatHaveCompletedSurveys, callback) {

    const db = databaseConnection;

    // DCOOKE - Create a list of survey IDs
    const agentIDs = agentsThatHaveCompletedSurveys.map(agent => agent.agentId);

    let returnedAgentWithAnswers = agentsThatHaveCompletedSurveys;

    db.query(`SELECT * FROM problem_agents WHERE AgentID IN (?)`, [agentIDs], (err, res) => {

        if (err) {
            callback(undefined, err);
        }


        const problemAgentsThatHaveCompletedSurveys = res;

        const answerIDs = problemAgentsThatHaveCompletedSurveys.map(
            (agent, index) => {
                returnedAgentWithAnswers[index].answerId = agent.AnswerID;
                return agent.AnswerID;
            }
        )


        let answerQuery = db.query(`SELECT * FROM survey_answers JOIN (tasks) ON (survey_answers.AnswerID IN (?) AND tasks.TaskID = survey_answers.TaskID)`, [answerIDs], (err, res) => {

            if (err) {
                callback(undefined, err);
            }


            const data = res;

            const surveyAnswers = data.map(row => {
                return {
                    answerId: row.AnswerID,
                    taskId: row.TaskID,
                    taskName: row.Name,
                    cost: row.Cost
                }
            })



            for (let i = 0; i < returnedAgentWithAnswers.length; i++) {
                returnedAgentWithAnswers[i].answers = surveyAnswers.filter(answer => answer.answerId === returnedAgentWithAnswers[i].answerId);
            }


            callback(returnedAgentWithAnswers, undefined);

        })

    })
}



function handleError(error, clientRes) {
    if (error) {
        clientRes.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        clientRes.end(`An error occurred when contacting the database`);
        throw error;
    }
}

function addCompletedAssignmentToDatabase(problemID, agentTaskAssignment , callback) {

    const db = mysql.createConnection(connection);
    const agentIDs = agentTaskAssignment.map(pair => pair.agent.agentId)
    const taskIDs = agentTaskAssignment.map(pair => pair.task.taskId)
    const insert = agentIDs.map(
        (agentId, index) => {

            return [problemID, agentId, taskIDs[index]]
        }
    );

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

module.exports = exports = assignmentObject;