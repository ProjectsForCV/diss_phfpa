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


    log(npa, "Initial Matrix: ")
    npa = __reduceRows__(npa)
    log(npa, "Reduced Rows: ")
    npa = __reduceCols__(npa)
    log(npa, "Reduced Columns: ")




"""Returns the highest cost assignment solution for matrix m (n by n)"""
def maximise(m):
    if(np.ndim(m) != 2):
        raise MatrixError(m)

def __isSolved__(m):
    # Checks if the matrix has been solved
    # TODO: This section is basically checking if the min number of lines covering zeroes = n

    pass

def log(matrix, message):
    print("%s\n" %message)
    print("%s\n" %matrix)
    print("--------------------------")

def __createNumpyArray__(m):
    return np.array(m)

def __reduceRows__(m):
    # Reduces rows in matrix n by subtracting the smallest value in each row from every other value in the row.
    for i in range(len(m)):
        m[i] = m[i] - min(m[i])

    return m

def __reduceCols__(m):
    # Reduces cols in matrix n by subtracting the smallest value in each col from every other value in the col.
    cols = []
    for i in m.T:
        cols.append(i - min(i))

    m = np.array(cols).T
    return m

def __drawLines__(m):
    # Marks the minimum amount of lines on the matrix that cross out a zero in every row/column
    assignedColumns = []
    assignedRows = []
    for rowIndex in range(len(m)):
#       Initialise array , assignedColumns = []
#       Initialise array, assignedRows = []
#       For Each Row in the Matrix
#           For Each Col in the Row
#               z = INDEX of next zero in row
#               IF z is IN assignedColumns
#                   continue
#               ELSE
#                   assignedRows.push(Index of this row)
        for colIndex in range(len(m[rowIndex])):
            z = m[rowIndex,colIndex].index(0)

testData = [
    [1,2,3],
    [3,1,2],
    [1,3,2]
]

minimise(testData)
