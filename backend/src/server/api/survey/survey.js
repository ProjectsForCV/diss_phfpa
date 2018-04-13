const mysql = require('mysql');
const connection = require('../../data/dbSettings');

function survey(app) {

    app.get('/api/survey/questions', (req, res) => {


        const surveyId = req.query.surveyId;
        getSurveyQuestions(surveyId, res);
    });

    app.post('/api/survey/answers', (req, res) => {

        const requestBody = req.body;
        const surveyID = requestBody['surveyID'];
        const answers = requestBody['answers'];
        postSurveyAnswers(surveyID, answers, res);


    })
}

function rollback(db, error, query) {
    db.rollback(() => {
        console.error('ERROR WITH QUERY: ' + query);
        throw error;
    })
}

function postSurveyAnswers(surveyID, answers, clientRes) {
    const db = mysql.createConnection(connection);

    db.beginTransaction((err) => {


        console.log(answers);
        db.query(`SELECT MAX(AnswerID) from survey_answers`, (err, res) => {

            if (err) {
                rollback(db, err);
            }
            const answerID = (res[0]['MAX(AnswerID)'] || 1) + 1;


            console.log(`${answers}`);
            
            const answerInsert = answers.map(
                answer => {
                    return [answerID, answer.TaskID, answer.cost]
                }
            );

            
            let answerQuery = db.query(`insert into survey_answers values ?`, [answerInsert], (err, res) => {

                if (err) {
                    rollback(db, err, answerQuery.sql);
                }

                let q = db.query(`update problem_agents set AnswerID = ?, Completed = ? where SurveyID =?`, [answerID, 1, surveyID], (err, res) => {
                    if (err) {
                        rollback(db, err, q);

                    }





                    db.commit();
                    console.log(`Survey ${surveyID} answers added. Answer ID ${answerID}`);

                    db.query('SELECT ProblemID from problem_agents WHERE SurveyID = ?', surveyID, (err, res) => {
                        const problemID = res[0]['ProblemID'];
                        
                        checkIfAllSurveysComplete(db, problemID, (res, err) => {
                            if (err) {
                                response.status(500).end(err);
                            } else {
                                response.status(200).end('Notifcation sent to organiser');
                            }
                        });

                        
                    })

                    


                    


                })

            })

        })


    });

}

function sendNotificationToOrganiser(problemID, callback) {
    const sendToOrganiser = require('../email/sendToOrganiser');
    sendToOrganiser(problemID, 
        (problem, agent, task, organiser) => {
            return `Hi, ${organiser.Name}!
            
            All ${problem.agentAlias || 'Agent'}s have completed their surveys.
            The next step is to choose how you wish the assignment to be solved, you can do so by visiting the
            following link:

            https://munkres.ml/assignment/${problemID}

            Regards,
            munkres.ml

            `;

        },
        (problem, agent, task, organiser) => {
            return `Assignment Ready`;
        },
        (res, err) => {

            callback(res, err);
        }
    );
}


function checkIfAllSurveysComplete(db, problemID, callback) {

    const getAgentDetails = require('../assignment/getAgentDetails');
    getAgentDetails(db, problemID, (res, err) => {

        if (err) {
            callback(err, undefined);
        } else {
            const numberOfCompletedAgents = res.map(agent => agent.completed).length;
            const totalAgents = res.length;

            if (numberOfCompletedAgents === totalAgents) {
                sendNotificationToOrganiser(problemID, (res, err) => {

                    callback(res, err);
                    
                    
                })
            }
        }
    })
}

function getSurveyQuestions(surveyId, clientResponse) {

    const db = mysql.createConnection(connection);

    db.query(`SELECT ProblemID, Completed from problem_agents where SurveyID= ?`, surveyId, (err, res) => {

        const problemID = res[0]['ProblemID'];
        const completed = res[0]['Completed'];


        db.query(`select TaskID from problem_tasks where ProblemID= ?`, problemID, (err, res) => {

            const taskIds = res.map(row => row.TaskID);


            let taskQuery = db.query(`select * from tasks where TaskID IN (?)`, [taskIds], (err, res) => {

                console.log(taskQuery.sql);
                console.log(res);
                const responseJson = {
                    tasks: res.map(row => {
                        return {taskName: row.Name, taskId: row.TaskID}
                    }),

                };

                db.query(`select TaskAlias, AgentAlias from problems where ProblemID = ?`, problemID, (err, res) => {


                    const taskAlias = res[0]['TaskAlias'];
                    const agentAlias = res[0]['AgentAlias'];

                    responseJson.taskAlias = taskAlias;
                    responseJson.agentAlias = agentAlias;


                    db.query(`select MaxSelection, MessageForAgents, AllowOptOut, OptOutMax from problems where ProblemID= ?`, problemID, (err, res) => {

                        if (err) {
                            throw err;
                        }
                        const data = res[0];
                        const surveyOptions = {
                            maxSelection: data['MaxSelection'],
                            message: data['MessageForAgents'],
                            allowOptOut: !!data['AllowOptOut'],
                            maxOptOut: data['OptOutMax']
                        };

                        responseJson.completed = completed;

                        responseJson.surveyOptions = surveyOptions;
                        clientResponse.json(responseJson);

                    });

                })

            })

        })

    })

}

module.exports = exports = survey;