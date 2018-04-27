const CostMatrixValidator = require('./CostMatrixValidator');
const CostMatrixException = require('./CostMatrixException');
const GeneticException = require('./GeneticException');
const exceptions = require('./ExceptionTypes');
class GeneticInputValidator extends CostMatrixValidator {
    constructor() {
        super();
    }
    static validateGeneticInputData(data) {

        let validAgentArray = true;
        let validCostMatrix = true;
        let matrix = [];
        // Test if the data is a properly formatted Agent[]
        try {
             matrix = data.map(agent => {
                return agent.answers.map(answer => {
                    return answer.cost
                })
        })
        } catch (invalidAgentFormatError) {
            validAgentArray = false;

            // check if its a valid number[][]
            try {
                this.validateCostMatrix(data);
            } catch(invalidCostMatrixError) {
                throw exceptions.invalidGeneticInput;
            }
        }

        // Its a valid Agent[], but we have to check if the resulting cost matrix is valid
        if (validAgentArray) {
            try {
                this.validateCostMatrix(matrix);
            } catch (invalidCostMatrixFormat) {
                throw invalidCostMatrixFormat;
            }
        } 

    
    }

}

/**
 * ensures the genetic options has all the required fields
 * @param {GeneticOptions} options 
 */
function correctFields(options) {
    return options['maxGenerations']
}

module.exports = exports = GeneticInputValidator;