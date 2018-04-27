const CostMatrixValidator = require('./CostMatrixValidator')
const exceptions = require('./ExceptionTypes');
class HungarianInputValidator extends CostMatrixValidator {

    constructor() {
        super();

    }

    static validateOptions(costMatrix, options) {
        if(!correctFields(options)) {
            throw exceptions.invalidOptionsFields;
        }

        if(!correctOptionsFormat(costMatrix, options)) {
            throw exceptions.invalidOptionsFormat;
        }
    }

   
}

/**
 * Ensures the options object contains the correct fields
 * @param {any} options 
 */
function correctFields(options) {
    // must contain arrays agents and tasks
    return options['agents'] && Array.isArray(options['agents'])
    && options['tasks'] && Array.isArray(options['tasks'])
}

/**
 * Ensures the option names match the cost matrix names
 * @param {any} options 
 */
function correctOptionsFormat(costMatrix, options) {
    HungarianInputValidator.validateCostMatrix(costMatrix);

    const matrixRows = costMatrix.length;
    const matrixCols = costMatrix[0].length;
    return matrixRows === options.agents.length && matrixCols === options.tasks.length;

}
module.exports = exports = HungarianInputValidator;