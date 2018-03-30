/***********************************************************************
 * Date: 29/03/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
    assignment.js is used as the api endpoint for all assignment related tasks
 */
/* ================================================================================================================== */
/*  IMPORTS  -   29/03/2018  -   DCOOKE
/* ================================================================================================================== */
const mysql = require('mysql');
const fs = require('fs');
const connection = require('../../data/dbSettings');
const uuid = require('uuid/v4');

/* ================================================================================================================== */
/*  FUNCTIONS -   29/03/2018  -   DCOOKE
/* ================================================================================================================== */
/*
 DCOOKE 29/03/2018 - the main function which takes the express server object to setup various api endpoints
 */
function assignment(app) {

    app.post('/api/assignment', (req, clientResponse) => {

        const assignment = req.body;
        createAssignmentProblem(assignment, clientResponse);

    });

    app.get('/api/assignment', (req, clientResponse) => {

        let assignment = {
            assignmentId: req.query.assignmentId
        };
        getAssignmentProblem(assignment, clientResponse);
    });



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
        if (err) { throw err; }

        // Get next problemID
        let q = db.query(`SELECT MAX(ProblemID) FROM problems`,(err, results) =>{

            if(err){
                rollback(db, err, q.sql)
            }


            //IF ProblemID is null set equal to 1;
            const problemID = (results[0]['MAX(ProblemID)'] || 1) + 1;


            // Get next task id
            let q = db.query('SELECT MAX(TaskID) FROM tasks' , (err, res) =>{

                if(err) {
                    rollback(db, err, q.sql)
                }
                const startingTaskID = ((res[0]['MAX(TaskID)'])  || 1) + 1;

                let problemTasks = [];
                const tasks = assignment.tasks.map((val, index) =>{
                    let taskArray = [];
                    let taskID = index + startingTaskID;

                    // Push task id to task array and , add to problem-tasks
                    taskArray.push(taskID);
                    taskArray.push(val);

                    problemTasks.push([problemID, taskID]);
                    return taskArray;
                });


                // Create Tasks
                let taskQuery = db.query('INSERT INTO tasks(TaskID,Name) VALUES ?',[tasks], (error, results) => {

                    if (error) {
                        rollback(db, error, taskQuery.sql);
                    }

                    // Get highest organiser id
                    let q = db.query('SELECT MAX(OrganiserID) FROM organisers', (err, res) => {

                        if (err) {
                            rollback(db, err, q.sql);
                        }

                        const organiserID = (res[0]['MAX(OrganiserID)'] || 1) + 1;
                        const organiser =  [organiserID, assignment.organiserName, assignment.organiserEmail];

                        // Create organiser
                        let query = db.query('INSERT INTO organisers(OrganiserID, Name, Email) VALUES (?, ?, ?)', organiser, (err, res) =>{

                            if (err) {

                                rollback(db, err, query.sql);
                            }

                            console.log(assignment.surveyOptions);
                            // Create problem
                            let problemQuery = db.query(`INSERT INTO problems(ProblemID, Name, OrganiserID, TaskAlias, AgentAlias, MaxSelection, AllowOptOut, MessageForAgents, OptOutMax) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                                ,[problemID,
                                    assignment.assignmentTitle,
                                    organiserID,
                                    assignment.taskAlias,
                                    assignment.agentAlias,
                                    parseInt(assignment.surveyOptions.maxSelection, 10),
                                    assignment.surveyOptions.allowOptOut,
                                    assignment.surveyOptions.message,
                                    parseInt(assignment.surveyOptions.maxOptOut,10)
                                ], (err, res) => {
                                    // Create agents and surveys
                                    // Get highest agent id
                                    if(err) {
                                        console.log(res);
                                        rollback(db, err, problemQuery.sql);
                                    }
                                    let q = db.query(`SELECT MAX(AgentID) FROM agents`, (err, res) => {

                                        if(err) {
                                            rollback(db, err, q.sql);
                                        }


                                        const startingAgentID = res[0]['MAX(AgentID)'] || 1;

                                        //Get highest survey ID
                                        let q = db.query(`SELECT MAX(SurveyID) from surveys`, (err, res) => {

                                            if(err){
                                                rollback(db, err, q.sql);
                                            }

                                            let surveys = [];
                                            let problemAgents = [];

                                            const agents = assignment.agents.map((agent ,index)=> {
                                                let agentsArray = [];
                                                let agentID = index + startingAgentID + 1;

                                                // create entry in ProblemAgents table as well as Agents table
                                                agentsArray.push(agentID);


                                                problemAgents.push([problemID, agentID]);


                                                agentsArray.push(agent.email);

                                                // create survey and add to agent array as well
                                                let surveyID =  uuid();
                                                surveys.push([surveyID]);
                                                agentsArray.push(surveyID);
                                                return agentsArray;
                                            });





                                            // INsert agents and surveys

                                            // Insert surveys
                                            let query = db.query('INSERT INTO surveys(SurveyID) VALUES ?' ,[surveys], (err, res) => {

                                                if (err) {
                                                    rollback(db, error, query.sql);
                                                }

                                                // Insert agents
                                                let q = db.query('INSERT INTO agents(AgentID, Email, SurveyID) VALUES ?', [agents], (err, res) => {

                                                    if(err){
                                                        rollback(db, error, q.sql);
                                                    }

                                                    // Insert Problem agents
                                                    let q2 = db.query(`INSERT INTO problem_agents(ProblemID, AgentID) VALUES ?`, [problemAgents], (err, res) => {

                                                        if (err) {
                                                            rollback(db, err, q2.sql);
                                                        }


                                                        let q = db.query('INSERT INTO problem_tasks(ProblemID, TaskID) VALUES ?' , [problemTasks], (err, res) => {

                                                            if (err) {
                                                                rollback(db, err, q.sql);
                                                            }

                                                            db.commit((err) => {
                                                                if (err) {
                                                                    rollback(db, err);
                                                                }

                                                                console.log(`Assignment : ${assignment.assignmentTitle} added to database. Successfully`);


                                                                ret = {problemId: problemID};
                                                                clientRes.json(ret);
                                                            })
                                                        })



                                                    })


                                                })
                                            })

                                        });


                                    })
                                });

                        });

                    });




                });
            });


        });
    });




}




function getAssignmentProblem(assignment, clientResponse) {


    const db = mysql.createConnection(connection);

    db.query(`SELECT * FROM problems WHERE ProblemID=?`, assignment.assignmentId, (err, res) => {

        if(err || !res[0]) {
            clientResponse.writeHead(500, {'Content-Type' : 'text/plain'});
            clientResponse.end(`An error occurred when contacting the database`);

        }
        // will always return 1 row
        data = res[0];

        assignment.assignmentTitle = data.Name;
        assignment.organiserId = data.OrganiserID;
        assignment.taskAlias = data.TaskAlias;
        assignment.agentAlias = data.AgentAlias;


        db.query(`SELECT * FROM organisers WHERE OrganiserID =?`, assignment.organiserId , (err, res) =>{
            if(err || !res) {
                clientResponse.writeHead(500, {'Content-Type' : 'text/plain'});
                clientResponse.end(`An error occurred when contacting the database`);

            }
            // will always return 1 row
            const data = res[0];
            assignment.organiserName = data.Name;
            assignment.organiserEmail = data.Email;

            db.query(`SELECT * FROM problem_agents WHERE ProblemID =?`, assignment.assignmentId , (err, res) =>{
                if(err || !res[0]) {
                    clientResponse.writeHead(500, {'Content-Type' : 'text/plain'});
                    clientResponse.end(`An error occurred when contacting the database`);

                }
                const data = res;
                // DCOOKE 29/03/2018 - Create list of agents
                assignment.agents = data.map(
                    row =>{

                        return {
                            agentId: row.AgentID,
                            completed: !!row.Completed

                        }
                    }
                );

                // DCOOKE 29/03/2018 - map to just ids for IN clause
                const agentIds = assignment.agents.map(agent => agent.agentId);

                let agentQuery = db.query(`SELECT * FROM agents WHERE AgentID IN (?)`, agentIds, (err, res) => {

                    const data = res;
                    console.log(data);
                    console.log(agentQuery.sql);
                    if(err || !res[0]) {
                        clientResponse.writeHead(500, {'Content-Type' : 'text/plain'});
                        clientResponse.end(`An error occurred when contacting the database`);

                    }

                    for(let i = 0 ; i < data.length; i ++) {
                        assignment.agents[i].email = data[i].Email;
                    }


                    console.log(assignment);
                    clientResponse.json(assignment);
                    /*
                     DCOOKE 29/03/2018 - TODO : THIS IS WHERE U GOT TO - finish getting task details and surveys

                     TODO _ PERHAPS WAIT UNTIL YOU HAVE FINISHED THE SURVEY FUNCTIONALITY
                     */
                })




            })
        })
    })
}

module.exports = exports = assignment;