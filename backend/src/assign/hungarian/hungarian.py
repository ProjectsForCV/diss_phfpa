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
    __reduceRows__(npa)
    return m


"""Returns the highest cost assignment solution for matrix m (n by n)"""

def maximise(m):
    if(np.ndim(m) != 2):
        raise MatrixError(m)



def __createNumpyArray__(m):
    return np.array(m)

def __reduceRows__(m):
    # Reduces rows in matrix n by subtracting the smallest value in each row from every other value in the row.
    for i in range(len(m)):
        m[i] = m[i] - min(m[i])

    return m

def __reduceCols__(m):
    # Reduces cols in matrix n by subtracting the smallest value in each col from every other value in the col.



testData = [
    [1,2,3],
    [3,2,1],
    [2,1,3]
]
minimise(testData)