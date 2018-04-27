// Title: hungarian_exceptions.js
// Author: Daniel Cooke 
// Date: 26/04/2018
/**
 * Hungarian exception store for various errors that can be encountered during runtime
 */
const Exception = require('./Exception');
class HungarianException extends Exception{

    constructor(message) {
        super(message);
    }
}



module.exports = exports = HungarianException;