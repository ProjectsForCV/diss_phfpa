/***********************************************************************
 * Date: 29/03/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 29/03/2018 - randomMat.js is used to return a random array to the client , called from the Playground
 */


 /**
  * sets up the endpoint for the random mat api
  * @param {Object} - app - the express object
  */
function randomMat(app){
    app.get('/api/costMatrix/randomMat/:rows/:cols', (request, response) => {


        const rows = request.params['rows'];
        const cols = request.params['cols'];

        const retArr = Array.from({length: rows}, () => createRandomCostArray(cols));


        response.writeHead(200, {'Content-Type': 'text/json'});


        response.end(JSON.stringify(retArr));

    });

}

/*
 DCOOKE 29/03/2018 - createRandomCostArray creates a shuffled 1D array with values in range 1...size
 */

function createRandomCostArray(size) {
    let start = 0;
    return Array.from({length: size}, () => {
        start += 1;
        return start;
    }).sort(() => Math.random() - 0.5)
}

exports = module.exports = randomMat;

