/***********************************************************************
 * Date: 27/04/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/**
 * Stores a reference to various exception messages
 */
const HungarianException = require('./HungarianException');
const CostMatrixException = require('./CostMatrixException');

const EXCEPTIONS = {
    invalidCostMatrixType : new CostMatrixException('Invalid cost matrix format, input should be a 2D Number Array'),
    invalidCostMatrixFormat: new CostMatrixException('Cost matrix has varying row lengths'),
    invalidOptionsFields: new HungarianException('Options must contain "agent" name array and "task" name array'),
    invalidOptionsFormat: new HungarianException('agent/task name array must match cost matrix dimensions')
};

module.exports = exports = EXCEPTIONS;