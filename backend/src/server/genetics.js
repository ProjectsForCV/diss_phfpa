const {
    spawn
} = require('child_process');
const {
    StringDecoder
} = require('string_decoder');


let rows = 0;
let cols = 0;
let costMatrix = [];
let groups = [];
let maxAssignments = 0;
let maxColumnAssignments = 0;

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

function distance(candidate, groups) {

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
        if (Math.random() < mutationChance) {

            mutationsThisGeneration++;

            candidates[i].assignment = getRandomAssignment();;
            candidates[i].totalCost = calculateTotalCost(candidates[i].assignment);

        }
    }
    console.log(`\tMutated: ${mutationsThisGeneration}`);

    return candidates;
}

function crossover(parents) {

    // I want parents.length offspring and all the parents in the next gen
    // I will take all the parents assignments
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

                if (isValidAssignment(lowestCostAssignment, newAssignment)) {

                    newAssignment.push(lowestCostAssignment);

                }

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

        console.log(`\tOffspring padded with ${offspringMaxLength - offspring.length} duplicates.`);

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
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

function selectParents(pop) {

    const smallestDistance = pop[0].distance;
    const maxDistance = pop[pop.length - 1].distance;
    const parents = [];

    while (parents.length !== Math.ceil(pop.length / 2)) {
        const slice = (Math.random() * (maxDistance - smallestDistance + 1) + smallestDistance);
        const potentialParents = pop.filter(c => c.distance <= slice);
        const parentIndex = randomIntBetweenInclusive(0, potentialParents.length - 1);

        parents.push(potentialParents[parentIndex]);
    }

    return parents;
}

function advanceGeneration(population, mutationChance, groups, rows, cols) {

    const sortedCandidates = sortByDistance(population);
    const mutatedCandidates = sortByDistance(mutate(sortedCandidates, mutationChance).map(
        (cand) => distance(cand, groups)));

    const parents = selectParents(mutatedCandidates);
    let nextGeneration = crossover(parents);
    if (nextGeneration.length < population.length) {
        // No offspring where created
        console.log(`No offspring created`);
        nextGeneration = mutatedCandidates;
    }
    return nextGeneration.map(c => distance(c, groups));


}

function sortByDistance(population) {
    return population.sort((a, b) => a.distance - b.distance);
}

function generatePopulation(costMatrix, rows, cols, n) {

    const population = [];
    while (population.length < n) {

        console.log(`population size: ${population.length}`);

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

function getNamedAssignments(data, finalResult, returnCandidates) {
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

function getMaxAssignmentsIfConstrainedColumns() {
    if (!groups || groups.length === 0) {
        return cols;
    }
    const numberOfColumnsConstrainedInGroups = groups.reduce((acc, curr) => acc += curr.cols.length, 0);
    const totalAssignmentsAllowedBetweenConstrainedColumns = groups.reduce((acc, curr) => curr.maxNumberOfAssignments, 0);
    return (cols - numberOfColumnsConstrainedInGroups) + totalAssignmentsAllowedBetweenConstrainedColumns;

}

function start(data, geneticOptions, rownames, colnames) {

    try {

        let matrix = [];

        let rowNames, colNames = [];
        const realAgents = !!data[0].answers;

        if (realAgents) {
            matrix = data.map(agent => {
                return agent.answers.map(answer => {
                    return answer.cost
                })
    
            })

            rowNames = data.map(agent => agent.agentId);
            colNames = data[0].answers.map(answer => answer.taskId);
        } else {
            matrix = data;
            colNames = colnames;
            rowNames = rownames;
        }


        rows = matrix.length;
        cols = matrix[0].length;
        costMatrix = matrix;

        groups = getGroups(geneticOptions.groups, colNames);


        maxColumnAssignments = getMaxAssignmentsIfConstrainedColumns();
        maxAssignments = Math.min(rows, maxColumnAssignments);



        let generation = 0;

        let population = generatePopulation(matrix, rows, cols, geneticOptions.populationSize);

        let bestPopulation = population;
        while (generation < geneticOptions.maxGenerations) {

            console.log(`\n\n\nGeneration ${generation+1} =================================\n`);
            population = sortByDistance(advanceGeneration(population.map(
                    (cand) => distance(cand, groups)),
                geneticOptions.mutationChance / 100,
                groups,
                rows,
                cols
            ));

            console.log(`\tBest Distance: ${population[0].distance}\n`);
            bestPopulation = Math.min(population[0].distance, bestPopulation[0].distance) === population[0].distance ?
                population : bestPopulation;
            if (population[0].distance < geneticOptions.distanceThreshold) {
                // Optimum stopping distance
                break;
            }
            generation++;
        }

        console.log(`======================================================================\n\tFINISHED\n\n`);

        console.log(`\tBest Candidate`);
        console.log(`\tTotal Cost: ${population[0].totalCost}`);
        console.log(`\tDistance: ${population[0].distance}`);
        console.log(population[0].assignment);



        if (realAgents) {
            return getNamedAssignments(data, population, geneticOptions.returnedCandidates);
        } else {
            return getSolvedMatrix(matrix, population, geneticOptions.returnedCandidates, rowNames, colNames);
        }



    } catch (err) {
        return -1;
    }



}

function getSolvedMatrix(mat, finalResult, returned, rownames, colnames) {
    finalResult = new Set((finalResult.sort((a, b) => a.distance - b.distance)));
    
    finalResult = Array.from(finalResult).slice(0, returned);
        
    
    const mapMatrix = 
    Array.from({length: finalResult.length}, () => {
        return Array.from({length: mat.length}, 
            () => Array.from({length: mat[0].length}, 
                () => 0))
    }).map(
        (solution, i) => getSolution(solution, finalResult[i].assignment)
    );



    function getSolution(emptyMatrix, assignment){
        for (let i = 0; i < assignment.length; i++) {
            emptyMatrix[assignment[i].row][assignment[i].col] = 1;
        }

        return emptyMatrix;
    }
    return finalResult.map((result, index) => {
            return {
                solution: mapMatrix[index],
                assignment: getAssignmentPairs(mapMatrix,rownames, colnames),
                totalCost: result.totalCost,
                distance: result.distance
            }
        })
    
    
}

function getAssignmentPairs(maskMatrix, rownames, colnames) {

    if (maskMatrix && colnames && rownames) {
        const pairs = [];
        for (let i = 0; i < rownames.length; i++) {
            for (let j = 0; j < colnames.length; j++) {

                if (maskMatrix[i][j] === 1) {

                    pairs.push({
                        agentId: rowNames[i],
                        taskId: colNames[j]
                    });
                }
            }
        }

        return pairs;
    }
}



exports = module.exports = start;