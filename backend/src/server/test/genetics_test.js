const geneticSolver = require('../genetic/genetics');
const assert = require('assert');
const input =  [[1,2,3], [3,2,1]];
const geneticOptions = {
    maxGenerations: 15,
    mutationChance: 0.3,
    returnedCandidates: 3,
    populationSize: 30,
    distanceThreshold: 3,
    groups: [],
    seed: 'unit-test'
};
const exceptions = require('../error/ExceptionTypes');

describe('Genetic Algorithm Test Suite', () => {

    describe('error handling', () => {
        it('should return invalidGeneticInput exception when input: 99999383', () => {
            assert.equal(geneticSolver(99999383,geneticOptions,null, null, false), exceptions.invalidGeneticInput);
        })

        it('should return invalidGeneticInput exception when input: "string"', () => {
            assert.equal(geneticSolver("string",geneticOptions,null, null, false), exceptions.invalidGeneticInput);
        })

        it('should return invalidGeneticInput exception when input does not contain answers', () => {
            const input = [
                {agentId: 123}
            ]
            assert.equal(geneticSolver(input ,geneticOptions, null, null, false), exceptions.invalidGeneticInput);
        })

        it('should return invalidCostMatrixFormat exception when input does not result in proper cost matrix', () => {
            const input = [
                {
                    agentId: 123,
                    answers: [
                        {
                            cost: 1
                        }
                    ]
                },
                {
                    agentId: 124,
                    answers: [
                        {
                            cost: 1
                        },
                        {
                            cost: 2
                        }
                    ]
                }
            ]
            assert.equal(geneticSolver(input ,geneticOptions,null, null, false), exceptions.invalidCostMatrixFormat);
        })
    });
    describe('functionality', () => {

        describe('[[1,2,3],[3,2,1]]', () => {
          
            describe('optimum candidate', () => {
                const optimum = geneticSolver(input, geneticOptions,['One','Two'],['1','2','3'], false)[0];
                it('should have a distance of 2', () => {
                    assert.equal(optimum.distance, 2)
                });

                it('should have a totalCost of 2', () => {
                    assert.equal(optimum.totalCost, 2)
                })
            })
            
        })

        describe('Group constraints', () => {
            describe('Task 1 and 2 - Maximum of 1 assignment' , () => {
                it('should not return a solution containing both task 1 and 2', () => {
                    const newOptions = geneticOptions;
                    newOptions.groups = [{
                        maxAssignments: 1,
                        tasks: [
                            {
                                taskId: '1'
                            },
                            {
                                taskId: '2'
                            }
                        ]
                    }]
                    const results = geneticSolver(input, newOptions,['One','Two'],['1','2','3'], false);
            
                    
                    const assignments = results.map(res => res.assignment);
                    const containsTask1 = assignments.filter(assignment => assignment.taskId === '1');
                    const containsTask2 = assignments.filter(assignment => assignment.taskId === '2');

                    assert.ok(containsTask1 !== containsTask2);
                })
            })
        })
    })
});
