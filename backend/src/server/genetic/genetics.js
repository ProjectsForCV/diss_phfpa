
const hungarian = require('../hungarian/hungarian');
let rows = 0;
let cols = 0;
let costMatrix = [];
let groups = [];
let maxAssignments = 0;
let maxColumnAssignments = 0;
let minimumTotalCost = 0;
let logging = true;
let generator;

function getGroups(groups, colNames) {

    const newGroups = groups.map(group => {
        return {
            maxNumberOfAssignments: group.maxAssignments,
            cols: group.tasks.map(task =>
                colNames.findIndex((colName) => colName === task.taskId)
            )
        }
    })

    return newGroups;

}

function distance(candidate) {

    // Minimise cost
    const cost = candidate.totalCost;

    // Keep groups within max number of assignments
    const assignmentsInEachGroup = groups;


    for (let j = 0; j < assignmentsInEachGroup.length; j++) {

        assignmentsInEachGroup[j].assignments = 0;

        for (let i = 0; i < candidate.assignment.length; i++) {
            if (assignmentsInEachGroup[j].cols.includes(candidate.assignment[i].col)) {
                assignmentsInEachGroup[j].assignments++;
            }
        }
    }

    const possibleAssignments = candidate.assignment.length;
    const surplusAssignments = assignmentsInEachGroup.reduce(
        (acc, curr) => {

            return acc + Math.max(curr.assignments - curr.maxNumberOfAssignments, 0)
        }, 0)

    // Return a candidate with attached fitness value

    function calculateDistance(cost, possibleAssignments, surplusAssignments) {
        // Euclidean distance to the ideal candidate which is at the origin of the graph
        const costTaskRatio = cost / possibleAssignments;
        return Math.pow(costTaskRatio + 1, surplusAssignments + 1);
    }


    candidate.distance = calculateDistance(cost, possibleAssignments, surplusAssignments);
    return candidate;

}

function mutate(candidates, mutationChance) {

    let mutationsThisGeneration = 0;
    for (let i = 0; i < candidates.length; i++) {
        if (randomRealBetweenInclusive(0,1) < mutationChance) {

            mutationsThisGeneration++;

            candidates[i].assignment = getRandomAssignment();;
            candidates[i].totalCost = calculateTotalCost(candidates[i].assignment);
            candidates[i].distance = distance(candidates[i], groups);

        }
    }
    log(`\tMutated: ${mutationsThisGeneration}`);

    return candidates;
}

function crossover(parents) {

    // I want parents.length offspring and all the parents in the next gen
    // I will take all the parents assignments
    if (parents.length <= 1) {
        return parents;
    }
    const parentAssignments = [].concat(...parents
        .map(parent => parent.assignment))

    const assignmentLength = parents[0].assignment.length;
    const offspringMaxLength = parents.length;
    const offspring = [];


    while (parentAssignments.length > 0) {


        let newAssignment = [];
        startAgain:
            while (newAssignment.length < assignmentLength) {

                const validAssignments = parentAssignments.filter(assignment => isValidAssignment(assignment, newAssignment));

                if (validAssignments.length === 0) {
                    break startAgain;
                }

                let lowestCostAssignment, lowestCostIndex;

                [lowestCostAssignment, lowestCostIndex] = findLowestCostAssignment(validAssignments);
                newAssignment.push(lowestCostAssignment);
                parentAssignments.splice(lowestCostIndex, 1);

            }

        if (newAssignment.length === assignmentLength) {
            offspring.push({
                totalCost: calculateTotalCost(newAssignment),
                assignment: newAssignment
            });
        }

    }

    if (offspring.length !== offspringMaxLength) {

        log(`\tOffspring padded with ${offspringMaxLength - offspring.length} duplicates.`);

        if (offspring.length === 0) {
            return parents;
        }
        return parents.concat(fillRemainingOffspring(offspring, offspringMaxLength))
    }

    function fillRemainingOffspring(offspring, maxLength) {

        while (offspring.length < maxLength) {
            // Pick a random offspring and duplicate it to pad out the gene pool

            offspring.push(offspring[randomIntBetweenInclusive(0, offspring.length - 1)])
        }

        return offspring;
    }

    return offspring.concat(parents);

}

function randomIntBetweenInclusive(min, max) {
    return generator.intBetween(min,max);
}

function randomRealBetweenInclusive(min, max) {
    return generator.floatBetween(min,max);
}

function isValidAssignment(newAssignment, currentAssignments) {
    if (currentAssignments.length === 0) {
        return true;
    }
    const assignedRows = currentAssignments.map(ass => ass.row);
    const assignedCols = currentAssignments.map(ass => ass.col);
    return !(assignedRows.includes(newAssignment.row) || assignedCols.includes(newAssignment.col))
}

function findLowestCostAssignment(assignment) {
    const lowest = assignment.reduce((acc, curr) => Math.min(curr.cost, acc.cost) === acc.cost ? acc : curr);
    const index = assignment.findIndex(val => val === lowest);
    return [lowest, index]
}

function truncate(candidates) {
    return candidates.concat(candidates.slice());
}

/**
 * Implements fitness proportionate selectection, where a roulette wheel is used to select
 * ideal solutions. In my scenario I am using distance so the function must be implemented
 * inversely.
 * @param {*} pop - population to select parents from
 */
function selectParents(pop) {

    // Calculate total distance of the population
    const totalDistance = pop.reduce((acc, curr) => acc += curr.distance, 0);
    
    // Array of parents to return
    let parents = [];

    // Each candidate should be assigned a weight
    // This weight value determines the likelihood of being selected as a parent
    // Candidates with small distance should have more chance of being selected
    const weights = [];
    for (let i = 0 ; i < pop.length; i++) {
        // Calculate weight for each candidate
        const distance = pop[i].distance;
        
        // Weight value will be small if the distance is large compared to the total
        const weight = totalDistance / (distance * totalDistance);
        weights.push(weight);
    }

    // Select parents, each parent can be selected multiple times
    while (parents.length < Math.ceil(pop.length/2)) { 
        parents.push(pop[selectParentByRoulette(weights)]);
    }


    return parents;
}
/**
 * Selects a parent based on their probability
 * @param {} weights : probability of a parent being selected
 */
function selectParentByRoulette(weights) {
    // A cumulative weight total should be calculated
    const totalWeight = weights.reduce((acc, curr) => acc += curr, 0);

    // Generate random real number between 0 and the total weight
    let section = randomRealBetweenInclusive(0, totalWeight);

    // Iterate through the candidates, (least probable first) and subtract the candidates
    // weight value from the randomly generated value
    // This will determine which "section" of the roulette the random number has landed on
    for (let i = weights.length -1; i > 0; i--) {
        section -= weights[i];

        // If the section is less than 0, the roulette has landed on this parent
        if (section < 0) {
            return i;
        }
    }

    // if something goes wrong just return the best candidate
    return 0;
}   

function sortByDistance(population) {
    return population.sort((a, b) => a.distance - b.distance);
}

function generatePopulation(costMatrix, rows, cols, n) {

    const population = [];
    while (population.length < n) {

        log(`population size: ${population.length}`);

        const assignment = getRandomAssignment(costMatrix, rows, cols);

        population.push({
            totalCost: calculateTotalCost(assignment),
            assignment: assignment
        })

    }


    return population;
}

function calculateTotalCost(assignment) {

    return assignment.map(assign => assign.cost).reduce((acc, curr) => acc + curr, 0);
}

function getRandomAssignment() {
    function isAssigned(array) {
        const set = new Set(array);
        return set.has(1) && set.size === 1;
    }


    const constrainedColumns = groups && groups.length > 0;
    // Pick a random vector to start at in the shorter dimension
    let colIndex = randomIntBetweenInclusive(0, cols - 1);
    let rowIndex = randomIntBetweenInclusive(0, rows - 1);

    let assignments = [];
    let assigned = false;

    while (!assigned) {


        let assignment = {}
        assignment.row = rowIndex;
        assignment.col = colIndex;

        assignment.cost = costMatrix[assignment.row][assignment.col];
        assignments.push(assignment);
        rowIndex = rowIndex + 1 > (rows - 1) ? 0 : rowIndex + 1;
        colIndex = colIndex + 1 > (cols - 1) ? 0 : colIndex + 1;

        assigned = assignments.length === maxAssignments;
    }

    return assignments;
}

/**
 * Returns the max number of column assignments
 * This value will be less than the number of cols if column constraints are in place
 */
function getMaxNumberOfColumnAssignments() {
    // If no groups are defined, the max number of column assignments is just cols
    if (!groups || groups.length === 0) {
        return cols;
    }
    const numberOfColumnsConstrainedInGroups = groups.reduce((acc, curr) => acc += curr.cols.length, 0);
    const totalAssignmentsAllowedBetweenConstrainedColumns = groups.reduce((acc, curr) => curr.maxNumberOfAssignments, 0);
    return (cols - numberOfColumnsConstrainedInGroups) + totalAssignmentsAllowedBetweenConstrainedColumns;

}

/**
 * 
 * @param {number[][] || Agent[]} data 
 * @param {GeneticOption} geneticOptions 
 * @param {string[]} rownames 
 * @param {string[]} colnames 
 */
function start(data, geneticOptions = {
    maxGenerations: 15,
    mutationChance: 0.3,
    returnedCandidates: 3,
    populationSize: 30,
    distanceThreshold: 3,
    groups: []
}, rownames, colnames, logging = true) {

    const e = require('../error/ExceptionTypes');
    try {
        const v = require('../error/GeneticInputValidator');
        v.validateGeneticInputData(data);
        
    } catch(error) {
        return error;
    }
    // Catch any errors 
    try {

        // Determine if the algorithm should use a seed (run deterministically) for unit tests
        generator = require('random-seed').create(geneticOptions.seed);

        // Turn on logging if no seed is supplied
        logging = !!logging;

        // Determine the lowest possible cost for this input

        // initialise matrix to prevent error
        let matrix = [];

        // initiliase rowNames and colNames to prevent error
        let rowNames, colNames = [];

        // realAgents is true if the data comes from the main-system
        // i.e. agent emails and task names are contained within the data structure
        const realAgents = !!data[0].answers;
    

        if (realAgents) {

            // Create a cost matrix from agent answers (this should probably be implemented before calling this routine)
            matrix = data.map(agent => {
                return agent.answers.map(answer => {
                    return answer.cost
                })
    
            })

            rowNames = data.map(agent => agent.agentId);
            colNames = data[0].answers.map(answer => answer.taskId);

        } else {
            // otherwise the data is a cost matrix already
            matrix = data;
            colNames = colnames;
            rowNames = rownames;
        }

        // Use the hungarian to find the minimum total cost for the distance function
        // This is a possibleimprovement to ensure the algorithm works better with no constraints
        // let hungarian = new h();
        // minimumTotalCost = hungarian.getMinimumTotalCost(matrix);


        // Set up rows and cols length
        rows = matrix.length;
        cols = matrix[0].length;
        costMatrix = matrix;

        // Groups are constraints set on the number of assignable columns
        groups = getGroups(geneticOptions.groups, colNames);


        // If a group is specified the maxColumnAssignments will be smaller than cols
        maxColumnAssignments = getMaxNumberOfColumnAssignments();

        // maxAssignments checks if the number rows is still less than the constrained columns
        maxAssignments = Math.min(rows, maxColumnAssignments);

        //===========================================================================================
        //		BEGIN GENETIC
        //===========================================================================================

        // Track the generation number
        let generation = 0;

        // Generate a random population of valid candidates
        let population = generatePopulation(matrix, rows, cols, geneticOptions.populationSize);

        while (generation < geneticOptions.maxGenerations) {

            log(`\n\n\nGeneration ${generation+1} =================================\n`);
            population = sortByDistance(advanceGeneration(population.map(
                    (cand) => distance(cand)),
                geneticOptions.mutationChance / 100,
                groups,
                rows,
                cols
            ));

            log(`\tBest Distance: ${population[0].distance}\n`);
            
            if (population[0].distance < geneticOptions.distanceThreshold) {
                // Optimum stopping distance
                break;
            }
            generation++;
        }

        //===========================================================================================
        //		LOG BEST CANDIDATE  
        //===========================================================================================
        log(`======================================================================\n\tFINISHED\n\n`);

        log(`\tBest Candidate`);
        log(`\tTotal Cost: ${population[0].totalCost}`);
        log(`\tDistance: ${population[0].distance}`);
        log(population[0].assignment);



        //===========================================================================================
        //		RETURN NAMED ASSIGNMENTS OR A SOLVED COST MATRIX TO CALLING FUNCTION
        //===========================================================================================
        if (realAgents) {
            return getTopResultsWithRealAgents(data, population, geneticOptions.returnedCandidates);
        } else {
            return getTopResultsWithDummyNames(matrix, population, geneticOptions.returnedCandidates, rowNames, colNames);
        }



    } catch (err) {
        console.error(err);
        
        return e.geneticError;
    }

}

function log(message) {
    if(!logging) return;
    console.log(message);
}
//===========================================================================================
//		ADVANCE GENERATION    
//===========================================================================================
/**
 * 
 * @param {*} population - a llist of candidate solutions
 * @param {*} mutationChance - a real number indicating the chance a candidate will receieve a mutation
 * @param {*} groups - a list of constrained columns
 * @param {*} rows - number of rows
 * @param {*} cols 
 */
function advanceGeneration(population, mutationChance, groups) {

    const sortedCandidates = sortByDistance(population);
    const mutatedCandidates = sortByDistance(mutate(sortedCandidates, mutationChance).map(
        (cand) => distance(cand)));

    const parents = selectParents(mutatedCandidates);

    let nextGeneration = crossover(parents);
    if (nextGeneration.length < population.length) {
        // No offspring where created
        log(`No offspring created`);
        nextGeneration = mutatedCandidates;
    }
    return nextGeneration.map(c => distance(c));


}


//===========================================================================================
//		RETURN FUNCTIONS
//===========================================================================================
/**
 * This function returns a solved matrix as well as assignment pairs
 * @param {*} mat - the initial costMatrix
 * @param {*} finalResult - the final population
 * @param {*} n - number of candidates to return from (top)
 * @param {*} rownames - names of the rows
 * @param {*} colnames  - names of the columns
 */
function getTopResultsWithDummyNames(mat, finalResult, n, rownames, colnames) {
    // Only want unique results
    finalResult = new Set((finalResult.sort((a, b) => a.distance - b.distance)));
    
    // Return top n candidates
    finalResult = Array.from(finalResult).slice(0, n);
        
    // Creates a 3D array where each entry is a resulting 2D matrix solution
    const solutionMatrix = 
    Array.from({length: finalResult.length}, 
        () => Array.from({length: mat.length}, 
            () => Array.from({length: mat[0].length}, 
                () => 0))
    ).map(
        (solution, i) => getSolution(solution, finalResult[i].assignment)
    );



    /**
     * map function to populate each 2D matrix contained in the 3D solution matrix
     * @param {*} emptyMatrix - an empty matrix to fill with a solution
     * @param {*} assignment - an assignment
     */
    function getSolution(emptyMatrix, assignment){
        for (let i = 0; i < assignment.length; i++) {
            emptyMatrix[assignment[i].row][assignment[i].col] = 1;
        }

        return emptyMatrix;
    }
    return finalResult.map((result, index) => {
            return {
                solution: solutionMatrix[index],
                assignment: getAssignmentPairs(solutionMatrix[index], mat ,rownames, colnames),
                totalCost: result.totalCost,
                distance: result.distance
            }
        })
    
    
}

/**
 *  this function returns assignment pairs: {agent, task, cost}
 * @param {*} maskMatrix - the assigned columns/rows
 * @param {*} costMatrix - the original cost data
 * @param {*} rownames 
 * @param {*} colnames 
 */
function getAssignmentPairs(maskMatrix, costMatrix, rownames, colnames) {

    if (maskMatrix && colnames && rownames) {
        const pairs = [];
        for (let i = 0; i < rownames.length; i++) {
            for (let j = 0; j < colnames.length; j++) {

                if (maskMatrix[i][j] === 1) {

                    pairs.push({
                        agent: {
                            agentId: rownames[i],
                            email: rownames[i]
                        },
                        task: {
                            taskId: colnames[j],
                            taskName: colnames[j]
                        },
                        cost: costMatrix[i][j]
                    });
                }
            }
        }

        return pairs;
    }
}

/**
 * This function is called to return a list of assignments with real agent names
 * @param {} data - the list of agents with survey answers passed from the main-system
 * @param {*} finalResult 
 * @param {*} returnCandidates 
 */
function getTopResultsWithRealAgents(data, finalResult, returnCandidates) {
    finalResult = (finalResult.sort((a, b) => a.distance - b.distance))
        .slice(0, returnCandidates);

    const tasks = data[0].answers.map(answer => answer);

    return finalResult.map(result => {
        return {
            totalCost: result.totalCost,
            distance: result.distance,
            assignment: result.assignment.map(matrix => {
                return {
                    agent: data[matrix.row],
                    task: {
                        taskId: tasks[matrix.col].taskId,
                        taskName: tasks[matrix.col].taskName
                    },
                    cost: matrix.cost
                }
            })
            
        }
    })
}


start(999999)

exports = module.exports = start;