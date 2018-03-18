const mysql = require('mysql');
const fs = require('fs');
const connection = require('../../data/dbSettings');
function assignment(app) {

    app.post('/api/assignment', (req, res) => {

        const assignment = req.body;
        beginTransaction(assignment);

    })


}

function rollback(db, error, query) {
    db.rollback(() => {
        console.error('ERROR WITH QUERY: ' + query);
        throw error;
    })
}

function beginTransaction(assignment) {
    // Create entry in database
    const db = mysql.createConnection(connection);

    db.connect();




    db.beginTransaction((err) => {
        if (err) { throw err; }

        // Get next problemID
        db.query(`SELECT MAX(ProblemID) FROM problems`,(err, results) =>{

            if(err){
                throw (err);
            }


            //IF ProblemID is null set equal to 1;
            const problemID = results[0]['MAX(ProblemID)'] || 1;


            // Get next task id
            db.query('SELECT MAX(TaskID) FROM tasks' , (err, res) =>{

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
                db.query('INSERT INTO tasks(TaskID,Name) VALUES ?',[tasks], (error, results) => {

                    if (error) {
                        rollback(db, error);
                    }

                    // Get highest organiser id
                    db.query('SELECT MAX(OrganiserID) FROM organisers', (err, res) => {

                        if (err) {
                            rollback(db, err);
                        }

                        const organiserID = (res[0]['MAX(OrganiserID)'] || 1) + 1;
                        const organiser =  [organiserID, assignment.organiserName, assignment.organiserEmail];

                        // Create organiser
                        let query = db.query('INSERT INTO organisers(OrganiserID, Name, Email) VALUES (?, ?, ?)', organiser, (err, res) =>{

                            if (err) {

                                rollback(db, err, query.sql);
                            }

                            // Create problem
                            let problemQuery = db.query(`INSERT INTO problems(ProblemID, Name, OrganiserID) VALUES (?, ?, ?)`
                                ,[problemID, assignment.assignmentTitle, organiserID], (err, res) => {
                                    // Create agents and surveys
                                    // Get highest agent id
                                    db.query(`SELECT MAX(AgentID) FROM agents`, (err, res) => {

                                        if(err) {
                                            rollback(db, err);
                                        }


                                        const startingAgentID = res[0]['MAX(AgentID)'] || 1;

                                        //Get highest survey ID
                                        db.query(`SELECT MAX(SurveyID) from surveys`, (err, res) => {

                                            if(err){
                                                rollback(db, err);
                                            }

                                            const startingSurveyID = (res[0]['MAX(SurveyID)'] || 1) + 1;
                                            let surveys = [];
                                            let problemAgents = [];
                                            const agents = assignment.agents.map((agent ,index)=> {
                                                let agentsArray = [];
                                                let agentID = index + startingSurveyID + 1;

                                                // create entry in ProblemAgents table as well as Agents table
                                                agentsArray.push(agentID);


                                                problemAgents.push([problemID, agentID]);


                                                agentsArray.push(agent.email);

                                                // create survey and add to agent array as well
                                                let surveyID = startingSurveyID + index;
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


                                                        db.query('INSERT INTO problem_tasks(ProblemID, TaskID) VALUES ?' , [problemTasks], (err, res) => {

                                                            if (err) {
                                                                rollback(db, err);
                                                            }

                                                            db.commit((err) => {
                                                                if (err) {
                                                                    rollback(db, err);
                                                                }

                                                                console.log(`Assignment : ${assignment.assignmentTitle} added to database. Successfully`);
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
module.exports = exports = assignment;