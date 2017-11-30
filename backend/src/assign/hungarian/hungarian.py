#   Filename: hungarian.py
#   Description: This is an implementation of the munkres assignment algorithm, a.k.a the hungarian algorithm
#   Author: Daniel Cooke
import numpy as np

from src.assign.hungarian.hungarian_exceptions import MatrixError

costMatrix = []
maskMatrix = []
step = 1

"""Returns the lowest cost assignment solution for matrix m (n by m)"""


def minimise(mat):
    global costMatrix
    global maskMatrix

    # Get dimensions of input matrix
    n = len(mat)
    m = len(mat[0])

    if (np.ndim(mat) != 2):
        raise MatrixError(mat)

    costMatrix = __createNumpyArray__(mat)
    maskMatrix = np.zeros((n, m), np.int8)

    solved = False

    while not solved:
        __logCostMatrix__()
        __logMaskMatrix__()

        if step == 1:
            __step1__()
        elif step == 2:
            __step2__()
        elif step == 3:
            __step3__()
        elif step == 4:
            __step4__()
        elif step == 5:
            __step5__()
        elif step == 6:
            __step6__()



"""Returns the highest cost assignment solution for matrix m (n by n)"""


def maximise(m):
    if (np.ndim(m) != 2):
        raise MatrixError(m)


def __isSolved__(m):
    # Checks if the matrix has been solved
    # TODO: This section is basically checking if the min number of lines covering zeroes = n

    pass


def __createNumpyArray__(m):
    return np.array(m)


def __step1__():
    # Reduces rows in matrix n by subtracting the smallest value in each row from every other value in the row.
    global costMatrix

    for i in range(len(costMatrix)):
        costMatrix[i] = costMatrix[i] - min(costMatrix[i])

def __step2__():
    pass

def __step3__():
    pass

def __step4__():
    pass

def __step5__():
    pass

def __step6__():
    pass


# def __reduceCols__():
#     # Reduces cols in matrix n by subtracting the smallest value in each col from every other value in the col.
#     global costMatrix
#     cols = []
#     for i in m.T:
#         cols.append(i - min(i))
#
#     m = np.array(cols).T
#     return m


def __drawLines__(m):
    # Marks the minimum amount of lines on the matrix that cross out a zero in every row/column
    pass


def __logMaskMatrix__():
    global maskMatrix
    print("Mask Matrix\n")
    print(maskMatrix)
    print("---------------------")


def __logCostMatrix__():
    global costMatrix
    print("Cost Matrix\n")
    print(costMatrix)
    print("---------------------")


# TODO: Validate matrix is (n x m) where the number of columns is >= rows
testData = [
    [1, 3, 4, 2, 5],
    [3, 2, 4, 5, 1],
    [3, 1, 5, 2, 4],
    [4, 3, 1, 2, 5]
]

minimise(testData)
