/***********************************************************************
 * Date: 27/04/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/**
 * The base class for custom application exceptions
 */
class Exception extends Error {

    static isException(value) {
        return value instanceof this;
    }

}

module.exports = exports = Exception;
