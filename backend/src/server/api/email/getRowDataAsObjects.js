/**
 *  Returns objects for emailContentFunction
 * @param {Object} assignment - row data from SQL query 
 */
function getRowDataAsObjects(assignment){
    const problem = {
        TaskAlias: assignment.TaskAlias,
        AgentAlias: assignment.AgentAlias
    };

    const agent = {
        Email: assignment.Email,
        SurveyID: assignment.SurveyID
    };

    const task = {
        Name: assignment.Name,
        Cost: assignment.cost
    };

    const organiser = {
        Name: assignment.Name,
        Email: assignment.Email
    };

    return {
        problem: problem,
        agent: agent,
        task: task,
        organiser: organiser
    };
}

module.exports = exports = getRowDataAsObjects;