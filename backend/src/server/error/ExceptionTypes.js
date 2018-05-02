/***********************************************************************
 * Date: 27/04/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/**
 * Stores a reference to various exception messages
 */
const HungarianException = require('./HungarianException');
const CostMatrixException = require('./CostMatrixException');
const GeneticException = require('./GeneticException');

const EXCEPTIONS = {
    invalidCostMatrixType : new CostMatrixException('Invalid cost matrix, input should be a 2D Number Array'),
    invalidCostMatrixFormat: new CostMatrixException('Cost matrix has varying row lengths'),
    invalidOptionsFields: new HungarianException('Options must contain "agent" name array and "task" name array'),
    invalidOptionsFormat: new HungarianException('agent/task name array must match cost matrix dimensions'),
    geneticError: new GeneticException('An error occurred when solving'),
    invalidGeneticInput: new GeneticException('Input data must be an array of completed agents or a 2D number array')
};

module.exports = exports = EXCEPTIONS;