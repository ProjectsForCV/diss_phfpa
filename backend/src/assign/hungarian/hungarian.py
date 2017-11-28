#   Filename: hungarian.py
#   Description: This is an implementation of the munkres assignment algorithm, a.k.a the hungarian algorithm
#   Author: Daniel Cooke
import numpy as np

from src.assign.hungarian.hungarian_exceptions import MatrixError



"""Returns the lowest cost assignment solution for matrix m (n by n)"""
def minimise(m):

    if(np.ndim(m) != 2):
        raise MatrixError(m)

    npa = __createNumpyArray__(m)
    assigned = False

    #while(assigned == False):

    __reduceRows__(npa)
    assigned = __isAssigned__(npa)


    print("Assigned :%a" % assigned)
    print(npa)



"""Returns the highest cost assignment solution for matrix m (n by n)"""

def maximise(m):
    if(np.ndim(m) != 2):
        raise MatrixError(m)

def __isAssigned__(m):
    # Checks if the matrix has been solved
    ass = True
    print(m)
    nonZeroSet =[]
    for row in m:
        nonZeroSet.append(np.array(row.nonzero()[0]))

    # If the set of non zeros is a different length than the original array it means there two rows that have a zero in the same place
    if (len(np.unique(nonZeroSet, axis=0)) != len(nonZeroSet)):
        ass = False

    nonZeroSet = []
    for col in m.T:
        nonZeroSet.append(np.array(col.nonzero()[0]))

    # If the set of non zeros is a different length than the original array it means there two rows that have a zero in the same place
    if (len(np.unique(nonZeroSet, axis=0)) != len(nonZeroSet)):
        ass = False

    return ass

def __createNumpyArray__(m):
    return np.array(m)

def __reduceRows__(m):
    # Reduces rows in matrix n by subtracting the smallest value in each row from every other value in the row.
    for i in range(len(m)):
        m[i] = m[i] - min(m[i])

    return m

def __reduceCols__(m):
    # Reduces cols in matrix n by subtracting the smallest value in each col from every other value in the col.

    pass

testData = [
    [1,2,3],
    [3,1,2],
    [1,3,2]
]
minimise(testData)