// Title: getRowDataAsObjects.js
// Author: Daniel Cooke 
// Date: 2018-04-14 15:53:40
/**
 * @typedef {Object} emailDataObject
 * @property {Object} problem
 * @property {Object} agent
 * @property {Object} task
 * @property {Object} organiser
 */

/**
 *  Returns objects for emailContentFunction
 * @param {Object} assignment - row data from SQL query 
 * @returns {emailDataObject}
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