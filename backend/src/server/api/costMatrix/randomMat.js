
function randomMat(app){
    app.get('/api/costMatrix/randomMat/:rows/:cols', (request, response) => {


        const rows = request.params['rows'];
        const cols = request.params['cols'];

        const retArr = Array.from({length: rows}, () => createRandomCostArray(cols));


        response.writeHead(200, {'Content-Type': 'text/json'});


        response.end(JSON.stringify(retArr));

    });

}

function createRandomCostArray(size) {
    let start = 0;
    return Array.from({length: size}, () => {
        start += 1;
        return start;
    }).sort(() => Math.random() - 0.5)
}

exports = module.exports = randomMat;

