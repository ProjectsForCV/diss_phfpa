const exceptions = require('./ExceptionTypes');
class CostMatrixValidator {

    constructor() {
        this.exceptions = exceptions;
    }

    static validateCostMatrix(costMatrix) {
        if (!twoDArray(costMatrix)) {
            throw this.exceptions.invalidCostMatrixType;
        }

        if(!correctCostMatrixFormat(costMatrix)){
            throw this.exceptions.invalidCostMatrixFormat;
        }
    }
}

/**
 * Ensures the cost matrix is of the correct format
 * @param {number[][]} costMatrix
 */
function twoDArray(costMatrix) {
    return Array.isArray(costMatrix) && Array.isArray(costMatrix[0]);
}

/**
 * ensures the cost matrix has the same row lengths for every row
 * @param {number[]][]} costMatrix
 */
function correctCostMatrixFormat(costMatrix) {

    const firstRowLength = costMatrix[0].length;
    return costMatrix.filter(row => row.length !== firstRowLength).length === 0;
}

module.exports = exports = CostMatrixValidator;
