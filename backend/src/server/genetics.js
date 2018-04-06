const {
    spawn
} = require('child_process');
const {
    StringDecoder
} = require('string_decoder');

const groups = [{
    cols: [0, 1],
    maxNumberOfAssignments: 1
},
{
    cols: [3],
    maxNumberOfAssignments: 0
}]

function genetics() {

    function getGroups(groups) {
        // TODO : map frontend group to cols
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
            const costTaskRatio = cost/possibleAssignments;
            return Math.pow(costTaskRatio + 1, surplusAssignments +1);
        }
    
    
        candidate.distance = calculateDistance(cost, possibleAssignments, surplusAssignments);
        return candidate;
    
    }
    
    function mutate(candidates, mutationChance) {
    
        for (let i = 0; i < candidates.length; i++) {
            if (Math.random() < mutationChance) {
    
                console.log(`Mutating Candidate ${i}`);
                
                candidates[i].assignment = getRandomAssignment(data.length, data[0].length);
                candidates[i].totalCost = calculateTotalCost(candidates[i].assignment);
    
            }
        }
    
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
            while (newAssignment.length < assignmentLength) {
                const validAssignments = parentAssignments.filter(assignment => isValidAssignment(assignment,newAssignment));
                if (validAssignments.length === 0) {
                    console.log(`Padding offspring with ${offspringMaxLength - offspring.length} duplicates.`);
                    
                    return parents.concat(fillRemainingOffspring(offspring, offspringMaxLength))
                }
                let lowestCostAssignment, lowestCostIndex;
                [lowestCostAssignment, lowestCostIndex] = findLowestCostAssignment(validAssignments);
                if (isValidAssignment(lowestCostAssignment, newAssignment)) {
                    newAssignment.push(lowestCostAssignment);
                }
                parentAssignments.splice(lowestCostIndex,1);
            }
    
            offspring.push(
                {   
                    totalCost: calculateTotalCost(newAssignment),
                    assignment: newAssignment
                });
    
        }
    
        function fillRemainingOffspring(offspring, maxLength) {
    
            while (offspring.length < maxLength) {
                // Pick a random offspring and duplicate it to pad out the gene pool
             
                 offspring.push(offspring[randomIntBetweenInclusive(0,offspring.length - 1)])
            }
    
            return offspring;
        }
      
        return offspring.concat(parents);
        
    }
    
    function randomIntBetweenInclusive(min, max) {
        return Math.floor(Math.random() * (max-min +1)) + min;
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
        const lowest = assignment.reduce((acc, curr) => Math.min(curr.cost,acc.cost) === acc.cost ? acc: curr );
        const index = assignment.findIndex(val => val === lowest);
        return [lowest, index]
    }
    
    function truncate(candidates) {
        return candidates.concat(candidates.slice());
    }
    
    function selectParents(pop) {
    
        const smallestDistance = pop[0].distance;
        const maxDistance = pop[pop.length -1].distance;
        const parents = [];
    
        while (parents.length !== 10) {
            const slice = (Math.random() * (maxDistance- smallestDistance +1) + smallestDistance) ;
            const potentialParents = pop.filter(c => c.distance <= slice);
            const parentIndex = Math.floor(Math.random() * potentialParents.length);
    
            parents.push(potentialParents[parentIndex]);
        }
    
        return parents;
    }
    
    function advanceGeneration(population, mutationChance) {
    
        const sortedCandidates = population.sort((a, b) => a.distance - b.distance);
        const mutatedCandidates = mutate(sortedCandidates, mutationChance);
        
        const parents = selectParents(mutatedCandidates);
        const nextGeneration = crossover(parents);
        return nextGeneration.map(distance);
    
    
    }
    
    function generatePopulation(costMatrix, rows, cols, n) {
    
        const population = [];
        while (population.length < n) {
    
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
    
    function getRandomAssignment(costMatrix, rows, cols) {
        function isAssigned(array) {
            const set = new Set(array);
            return set.has(1) && set.size === 1;
        }
        const shorter = Math.min(cols, rows) === rows ?
            Array.from({
                length: rows
            }, () => 0) :
            Array.from({
                length: cols
            }, () => 0);
        const longer = Math.max(cols, rows) === rows ?
            Array.from({
                length: rows
            }, () => 0) :
            Array.from({
                length: cols
            }, () => 0);
    
        // Pick a random vector to start at in the shorter dimension
        let shortIndex = Math.floor(Math.random() * (shorter.length - 1));
        let longIndex = Math.floor(Math.random() * (longer.length - 1));
        let assignments = [];
        let assigned = false;
    
        while (!assigned) {
    
            // Make a random guess in the longer matrix and set the shorter to 1
            if (longer[longIndex] === 1) {
                longIndex = longIndex + 1 > longer.length - 1 ? 0 : longIndex + 1;
                continue;
            } else {
                shorter[shortIndex] = 1;
                longer[longIndex] = 1;
                let assignment = {}
                assignment.row = rows < cols ? shortIndex : longIndex;
                assignment.col = cols < rows ? shortIndex : longIndex;
                assignment.cost = costMatrix[assignment.row][assignment.col];
                assignments.push(assignment);
                shortIndex = shortIndex + 1 > shorter.length - 1 ? 0 : shortIndex + 1;
                longIndex = longIndex + 1 > longer.length - 1 ? 0 : longIndex + 1;
            }
    
    
    
            assigned = isAssigned(shorter);
        }
    
        return assignments;
    }
    
    function getNamedAssignments(data, finalResult, returnCandidates) {
        finalResult = (population.sort((a,b) => a.distance - b.distance))
                        .slice(0, returnCandidates);
    }
    
    function start(data, geneticOptions) {
        // Find shorter dimension
        const matrix = data.map(agent => {
            return agent.answers.map(answer => {
                    return answer.cost
                })
            
        })
        const rows = matrix.length;
        const cols = matrix[0].length;

        getGroups();
    
        let generation = 0;
    
        let population = generatePopulation(matrix, rows, cols, 40);
    
        while (generation < geneticOptions.generationMax) {
            population = advanceGeneration(population.map(distance), geneticOptions.mutationChance);
            generation++;
        }
    
        return getNamedAssignments(data, population, geneticOptions.returnCandidates);
    
        
    }
}



exports = module.exports = genetics;

