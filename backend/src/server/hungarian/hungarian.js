//   Filename: hungarian.py
//   Description: This is an implementation of the munkres assignment algorithm, a.k.a the hungarian algorithm
//   Author: Daniel Cooke
const validator = require('../error/HungarianInputValidator');
const hungarianException = require('../error/HungarianException');

class Hungarian {

    constructor() {
        // The input matrix is stored to output the final allocation to the user
        this.originalMatrix = [];

        // The cost matrix will be altered at various steps in the munkres algorithm, it will always mirror the input matrix
        // however.
        this.costMatrix = [];

        // The mask matrix will be used to mark zeroes as primed or starred, 0 = unaltered, 1 = starred, 2 = primed.
        this.maskMatrix = [];

        // The step counter will be used to keep track of the current step of the algorithm, this is to allow jumping in some
        // scenarios .
        this.step = 1;

        // The input matrix dimensions will be stored in the following variables. Where n is the number of rows and m is the
        // number of columns.
        this.rows = 0;
        this.cols = 0;

        // The boolean to control the loop flow
        this.solved = false;

        // The algorithm requires the covering of rows and columns, these arrays will keep track of rows and columns that are
        // covered.
        this.coveredRows = [];
        this.coveredCols = [];

        // We must store the uncovered prime zero from step 4
        this.uncoveredPrimedZero = {
            row: 0,
            col: 0
        };

        return this;
    }

    // Function to initialise variables required for a run through of the algorithm
    setup(costMatrix) {
        
        this.costMatrix = costMatrix.slice();
        this.originalMatrix = costMatrix.slice();
        this.dummyRows = 0;

        const rows = this.costMatrix.length;
        const cols = this.costMatrix[0].length;

        // Make sure matrix has as many rows as columns by appending dummy rows if necessary
        if (rows < cols) {
            while (this.costMatrix.length < this.costMatrix[0].length) {
                this.costMatrix.push(Array.from({length: cols}, () =>0) )
                this.dummyRows++;
            }
        }

        this.rows = this.costMatrix.length;
        this.cols = this.costMatrix[0].length;

        // Set up mask matrix
        this.maskMatrix = Array.from({length: this.rows}, () => Array.from({length: this.cols}, ()=> 0));

        // Assign covered rows and cols mem space
        this.coveredCols = Array.from({length: this.cols}, () => 0);
        this.coveredRows = Array.from({length: this.rows}, () => 0);
    }


    iterate() {
        while (!this.solved) {

            switch (this.step) {
                case 1: {
                    this.step1();
                    break;
                }
                case 2: {
                    this.step2();
                    break;
                }
                case 3: {
                    this.step3();
                    break;
                }
                case 4: {
                    this.step4();
                    break;
                }
                case 5: {
                    this.step5();
                    break;
                }
                case 6: {
                    this.step6();
                    break;
                }
            }
        }
    }


    minimise(costMatrix, options) {

        try {
            validator.validateCostMatrix(costMatrix);

            if (options) {
                validator.validateOptions(costMatrix, options);
            }
        }
        catch (HungarianException) {
            return HungarianException;
        }
        
        
        this.setup(costMatrix);
      
        this.iterate();

        if (options && options.tasks && options.agents) {
            return {
                solution: this.maskMatrix.slice(0,this.maskMatrix.length - this.dummyRows),
                assignment: this.getAssignmentPairs(options)
            };
        }
        return {
            solution: this.maskMatrix.slice(0,this.maskMatrix.length - this.dummyRows)
        };
    }

    
    getMinimumTotalCost(costMatrix) {
        const result = this.minimise(costMatrix);
        const solution = result['solution'];
        return solution.reduce((acc, curr, row) => {
            const assignedColumn = curr.findIndex(val => val === 1)
            return acc += this.originalMatrix[row][assignedColumn]
        }, 0);
    }
    
    getAssignmentPairs(options) {
        const tasks = options.tasks;
        const agents = options.agents;

    
        const pairs = [];
        for (let i = 0; i < agents.length; i++) {
            for (let j = 0; j < tasks.length; j++) {

                if (this.maskMatrix[i][j] === 1) {

                    pairs.push({
                        agent: agents[i],
                        task: tasks[j],
                        cost: this.originalMatrix[i][j]
                    });
                }
            }
        }

        return pairs;
    }

    step1() {

        // For each row of the matrix, find the smallest element and subtract it from every element in its row.
        // Go to Step 2.
        for (let i = 0; i < this.rows; i++) {
            this.costMatrix[i] = subtractValueFromArray(this.costMatrix[i], min(this.costMatrix[i]));
        }

        this.step = 2;
    }

    step2() {

        // Find a zero (Z) in the resulting matrix.  If there is no starred zero in its row or column, star Z. Repeat for
        // each element in the matrix. Go to Step 3.

        const assignedCols = zeros(this.cols);
        const assignedRows = zeros(this.rows);
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {

                if (this.costMatrix[i][j] === 0 && assignedCols[j] === 0 && assignedRows[i] === 0) {
                    this.maskMatrix[i][j] = 1;
                    assignedCols[j] = 1;
                    assignedRows[i] = 1;
                    continue;
                }
            }
        }

        this.step = 3;
        for (let i =0 ; i < this.cols ; i++) {

        }
    }

    step3() {
        // Cover each column containing a starred zero.  If K columns are covered, the starred zeros describe a complete set
        // of unique assignments.  In this case, Go to DONE, otherwise, Go to Step 4.
        let count = 0;
        const columns = transpose(this.maskMatrix);

        for (let i =0 ; i < this.cols ; i++) {
            const starredZeroInCol = findInArray(columns[i], 1) >= 0;    
            if (starredZeroInCol){
                count++;
                this.coveredCols[i] = 1;
            }
        }

        if (count >= this.rows || count >= this.cols){
            this.step = 999;
            this.solved = true;
            return;
        }

        this.step = 4;
    }

    step4() {
        // Find a noncovered zero and prime it.  If there is no starred zero in the row containing this primed zero,
        // Go to Step 5.  Otherwise, cover this row and uncover the column containing the starred zero.
        // Continue in this manner until there are no uncovered zeros left. Save the smallest uncovered value and
        // Go to Step 6.
        for (let i =0 ; i < this.rows ; i++) {
            for (let j = 0; j < this.cols; j++) {
                // Find a non covered zero and prime it
                if (this.costMatrix[i][j] === 0 && this.coveredCols[j] === 0 && this.coveredRows[i] == 0) {

                    // Prime the uncovered zero
                    this.maskMatrix[i][j] = 2;

                    // there is no starred zero in the row - go to Step 5
                    if (findInArray(this.maskMatrix[i], 1) < 0) {

                        this.step = 5;
                        this.uncoveredPrimedZero.row = i;
                        this.uncoveredPrimedZero.col = j;
                        return;

                    } else {
                        // there is a starred zero, cover the containing row
                        this.coveredRows[i] = 1;

                        // uncover the containing column
                        this.coveredCols[findInArray(this.maskMatrix[i], 1)] = 0;
                    }
                }
            }
        }   
        
        // no uncovered zeros left
        this.step = 6;

    }

    step5() {
    // Construct a series of alternating primed and starred zeros as follows.  Let Z0 represent the uncovered primed
    // zero found in Step 4.  Let Z1 denote the starred zero in the column of Z0 (if any).
    // Let Z2 denote the primed zero in the row of Z1 (there will always be one).
    // Continue until the series terminates at a primed zero that has no starred zero in its column.
    // Unstar each starred zero of the series, star each primed zero of the series, erase all primes and uncover every
    // line in the matrix.  Return to Step 3.

        const series = [];
        let done = false;

        // First entry is the uncovered from step 4
        series.push(this.uncoveredPrimedZero);

        while (!done) {
            let c = series[series.length -1]['col'];

            // Find a starred zero in the column of the last primed zero
            let r = this.findStarInCol(c);

            if (r > -1) {
                // Add this starred zero to the series
                series.push({
                    row: r,
                    col: c
                });
            } else {
                 // If there is no star in this column we are done
                done = true;
                break;
            }

            // Continue by adding another primed zero from the row of the last starred zero
            c = this.findPrimeInRow(r);
            series.push({
                row: r,
                col: c
            });
            
        }

        // Single responsiblity principle
        this.augmentSeries(series);
        this.uncoverLines();
        this.emptyPrimes();
        this.step = 3;

    }

    step6() {
        // Add the value found in Step 4 to every element of each covered row, and subtract it from every element of
        // each uncovered column.  Return to Step 4 without altering any stars, primes, or covered lines.
        let smallestUncovered = this.findSmallestUncoveredValue();

        for (let i = 0 ; i < this.rows ; i++) {
            for (let j = 0 ; j < this.cols ; j++) {
                
                if (this.coveredRows[i] == 1) {
                    this.costMatrix[i][j] += smallestUncovered;
                }
                
                if (this.coveredCols[j] == 0) {
                    this.costMatrix[i][j] -= smallestUncovered;
                }
            }
        }

        this.step = 4;
    }

    findSmallestUncoveredValue() {
        let min = 99999999999;
        for (let i =0 ; i < this.rows ; i++) {
            for (let j = 0 ; j < this.cols ; j++) {
                if (this.costMatrix[i][j] < min && this.coveredRows[i] == 0 && this.coveredCols[j] == 0){
                    min  = this.costMatrix[i][j];
                }   
            }
        }

        return min;
    }
    augmentSeries(series) {
        // A helper method to augment the series of alternating primed/starred zeroes from step 5.
        // It will perform the following :
        // Unstar each starred zero of the series, star each primed zero of the series       

        for (let i = 0 ; i < series.length ; i++) {
            
            if (i % 2 === 0) {
                // Star the prime
                this.maskMatrix[series[i]['row']][series[i]['col']] = 1;
            } else {
                this.maskMatrix[series[i]['row']][series[i]['col']] = 0;
            }

        }
    }

    uncoverLines() {
        this.coveredRows = this.coveredRows.map(val => 0);
        this.coveredCols = this.coveredCols.map(val => 0);
    }
    emptyPrimes() {
        for (let i = 0 ; i < this.rows ; i++) {
            for (let j = 0 ; j < this.cols ; j++) {
             
                if (this.maskMatrix[i][j] == 2) {
                    this.maskMatrix[i][j] = 0;
                }
            }
        }
    }
    findPrimeInRow(row) {
        return findInArray(this.maskMatrix[row], 2);
    }

    findStarInRow(row) {
        return findInArray(this.maskMatrix[row], 1);
    }
    findStarInCol(col) {
        return findInArray(transpose(this.maskMatrix)[col], 1);
    }
    findPrimeInCol(col) {
        return findInArray(transpose(this.maskMatrix)[col], 1);
    }

}

function printTotal(array, comparator) {
    console.log(array.filter(comparator).length);
}



function findInArray(array, value) {
    return array.findIndex(val => val === value);
}

function transpose(array) {
    return array[0].map((col, i) => array.map(row => row[i]));
}

function zeros(length) {
    return Array.from({length: length}, () => 0);
}
// Returns the smallest value in an array
function min(array) {
    return Math.min.apply(null, array);
}

// Subtracts an interger from every value in an array of integers
function subtractValueFromArray(array, value) {
    return array.map( arrVal => arrVal - value);
}



module.exports = exports = Hungarian;

