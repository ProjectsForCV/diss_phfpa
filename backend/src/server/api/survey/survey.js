const mysql = require('mysql');
const connection = require('../../data/dbSettings');

function survey(app) {

    app.get('/api/survey/questions', (req, res) =>{


        const surveyId = req.query.surveyId;
        getSurveyQuestions(surveyId, res);
    })
}

function getSurveyQuestions(surveyId, clientResponse) {

    const db = mysql.createConnection(connection);
    db.query(`SELECT AgentID FROM agents where SurveyID= ? ` ,surveyId , (err, res) => {

        const agentID = res[0]['AgentID'];
        db.query(`SELECT ProblemID from problem_agents where AgentID= ?` , agentID, (err, res) => {

            const problemID = res[0]['ProblemID'];

            db.query(`select TaskID from problem_tasks where ProblemID= ?` , problemID, (err, res) => {

                const ids = res.map(row => row.TaskID);


                console.log(ids);
                let taskQuery = db.query(`select * from tasks where TaskID IN (?)`, [ids], (err, res) => {

                    console.log(taskQuery.sql);
                    console.log(res);
                    const responseJson = {
                        tasks: res.map(row => row.Name),

                    };

                    db.query(`select TaskAlias from problems where ProblemID = ?` , problemID, (err, res) => {


                        const alias = res[0]['TaskAlias'];

                        responseJson.taskAlias = alias;

                        db.query(`select MaxSelection, MessageForAgents, AllowOptOut, OptOutMax from problems where ProblemID= ?`,problemID
                            ,(err,res) =>{

                            if(err){
                                throw err;
                            }
                                const data = res[0];
                                const surveyOptions = {
                                    maxSelection: data['MaxSelection'],
                                    message: data['MessageForAgents'],
                                    allowOptOut: data['AllowOptOut'],
                                    maxOptOut: data['OptOutMax']
                                };

                                responseJson.surveyOptions = surveyOptions;
                                clientResponse.json(responseJson);

                            }
                        );

                    })

                })

            })

        })
    } )
}

module.exports = exports = survey;