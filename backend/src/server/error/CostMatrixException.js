/***********************************************************************
 * Date: 27/04/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/**
 * A cost matrix exception is thrown when an invalid cost matrix is provided to either algorithm
 */
const Exception = require('./Exception');
class CostMatrixException extends Exception{

    constructor(message) {
        super(message);
    }

}

module.exports = exports = CostMatrixException;