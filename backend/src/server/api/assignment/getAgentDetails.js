function getAgentDetails(databaseConnection, problemID, callback) {

    const db = databaseConnection;

    let agentDetails = {};

    db.query(`SELECT * FROM problem_agents WHERE ProblemID =?`, problemID, (err, res) => {

        if (err) {
            callback(undefined, err);
        }

        const listOfAgentsFromProblem = res;

        // DCOOKE 29/03/2018 - Create initial agent objects
        agentDetails = listOfAgentsFromProblem.map(
            row => {


                return {
                    agentId: row.AgentID,
                    completed: row.Completed,
                    surveyId: row.SurveyID

                }
            }
        );

        //
        //	GET MORE AGENT INFO 
        //

        // DCOOKE 29/03/2018 - map to just ids for IN clause
        const agentIds = agentDetails.map(agent => agent.agentId);

        let agentQuery = db.query(`SELECT * FROM agents WHERE AgentID IN (?)`, [agentIds], (err, res) => {

            if (err) {
                callback(undefined, err);
            }

            const detailedListOfAgentsFromProblem = res;


            for (let i = 0; i < detailedListOfAgentsFromProblem.length; i++) {
                agentDetails[i].email = detailedListOfAgentsFromProblem[i].Email;
            }

            callback(agentDetails, undefined);



        })


    })
}

module.exports = exports = getAgentDetails;