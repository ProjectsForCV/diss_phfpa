const assert = require('assert');
const hungarian = require('../hungarian/hungarian');
const exceptions = require('../error/ExceptionTypes')

describe('Hungarian Algorithm Test Suite', () => {
    describe('Hungarian.minimise()', () => {

        beforeEach(() => {
            h = new hungarian();
            
        })
        describe('error' , () => {
            it('should return invalidCostMatrixType exception when input: 1238547257', () => {
                const input = 1238547257;
                assert.deepStrictEqual(h.minimise(input),exceptions.invalidCostMatrixType);
            })
    
            it('should return invalidCostMatrixType exception when input: "string"', () => {
                const input = "string";
                assert.deepStrictEqual(h.minimise(input),exceptions.invalidCostMatrixType);
            })
    
            it('should return invalidCostMatrixFormat exception when cost matrix has varying row lengths', () => {
                const inputMatrix = [[1,2,3],[3,2,1,5,6]]
                assert.deepStrictEqual(h.minimise(inputMatrix), exceptions.invalidCostMatrixFormat);
            })
        
            it('should return invalidOptionsFormat exception when task names length does not match matrix columns', () => {
                const inputMatrix = [[1,2,3],[3,2,1]]
                const inputOptions = {
                    tasks: ["One", "Two"],
                    agents: ["One", "Two"]
                }
    
                assert.deepStrictEqual(h.minimise(inputMatrix, inputOptions), exceptions.invalidOptionsFormat);
            })
    
            it('should return invalidOptionsFormat exception when agent names length does not match matrix columns', () => {
                const inputMatrix = [[1,2,3],[3,2,1]]
                const inputOptions = {
                    tasks: ["One", "Two", "Three"],
                    agents: ["One", "Two", "Three"]
                }
    
                assert.deepStrictEqual(h.minimise(inputMatrix, inputOptions), exceptions.invalidOptionsFormat);
            })
        })
    
        describe('functionality', () => {
            it('should return solution matrix when no options are passed', () => {
                const inputMatrix = [[1,2,3],[3,2,1]]
        
                assert.ok(h.minimise(inputMatrix)['solution']);
            })
    
            it('should NOT return assignment pairs when no options are passed', () => {
                const inputMatrix = [[1,2,3],[3,2,1]]
        
                assert.ok(!h.minimise(inputMatrix)['assignment']);
            })
    
            it('should return solution matrix when task/agent names specified', () => {
                const inputMatrix = [[1,2,3],[3,2,1]]
                const inputOptions = {
                    tasks: ["One", "Two", "Three"],
                    agents: ["One", "Two"]
                }
                assert.ok(h.minimise(inputMatrix, inputOptions)['solution']);
            })
    
            it('should return assignment pairs when task/agent names specified', () => {
                const inputMatrix = [[1,2,3],[3,2,1]]
                const inputOptions = {
                    tasks: ["One", "Two", "Three"],
                    agents: ["One", "Two"]
                }
                assert.ok(h.minimise(inputMatrix, inputOptions)['assignment']);
            })
        })
    })
    
    describe('Hungarian.getMinimumTotalCost()', () => {
        beforeEach(() => {
            h = new hungarian();
            
        })
        describe('when input is [1,2,3],[3,2,1]', () => {
            it('should return 2', () => {
                input = [[1,2,3],[3,2,1]];
                assert.equal(h.getMinimumTotalCost(input), 2);
            })
        })
    
        describe('when input is [1,2,3],[1,3,2]', () => {
            it('should return 3', () => {
                input = [[1,2,3],[1,3,2]];
                assert.equal(h.getMinimumTotalCost(input), 3);
            })
        })
    })
})
