#   Filename: hungarian.py
#   Description: This is an implementation of the munkres assignment algorithm, a.k.a the hungarian algorithm
#   Author: Daniel Cooke
import numpy as np

from src.assign.hungarian.hungarian_exceptions import MatrixError

# The input matrix is stored to output the final allocation to the user
originalMatrix = []

# The cost matrix will be altered at various steps in the munkres algorithm, it will always mirror the input matrix
# however.
costMatrix = []

# The mask matrix will be used to mark zeroes as primed or starred, 0 = unaltered, 1 = starred, 2 = primed.
maskMatrix = []

# The step counter will be used to keep track of the current step of the algorithm, this is to allow jumping in some
# scenarios .
step = 1

# The input matrix dimensions will be stored in the following variables. Where n is the number of rows and m is the
# number of columns.
n, m = 0, 0

# I need to store the original dimensions in case a rectangular matrix was passed in, as n and m will be padded with
# dummy data.
inputN, inputM = 0, 0

# The global boolean to control the loop flow
solved = False

# The algorithm requires the covering of rows and columns, these arrays will keep track of rows and columns that are
# covered.
coveredCols, coveredRows = [], []

# It is required to store the smallest uncovered value
smallestUncovered = 0

"""Returns the lowest cost assignment solution for matrix m (n by m)"""


def minimise(mat, rownames, colnames):
    global costMatrix, maskMatrix, originalMatrix
    global n, m, step, inputM, inputN
    global coveredCols, coveredRows, smallestUncovered

    # Get dimensions of input matrix
    inputN = len(mat)
    inputM = len(mat[0])

    # Make sure matrix has as many rows as columns by appending dummy rows if necessary
    if inputN < inputM:
        diff = inputM - inputN
        while(diff > 0):
            mat.append(np.zeros(inputM, np.int8))
            diff -= 1

    # Update real dimensions after potential dummy rows
    n = len(mat)
    m = len(mat[0])


    if (np.ndim(mat) != 2):
        raise MatrixError(mat)

    # Set up various matricies
    costMatrix = __createNumpyArray__(mat)
    maskMatrix = np.zeros((n, m), np.int8)
    originalMatrix = mat

    # Assign covered rows and covered columns memory space
    coveredRows = np.zeros(n, np.int8)
    coveredCols = np.zeros(m, np.int8)



    while not solved:
        __logCostMatrix__()
        __logMaskMatrix__()
        print("Step %s" % step)

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

    __logFinalResult__(rownames, colnames)


"""Returns the highest cost assignment solution for matrix m (n by n)"""


def maximise(m):
    if (np.ndim(m) != 2):
        raise MatrixError(m)


def __createNumpyArray__(m):
    return np.array(m)


def __step1__():
    global step, costMatrix
    # For each row of the matrix, find the smallest element and subtract it from every element in its row.
    # Go to Step 2.
    for i in range(len(costMatrix)):
        costMatrix[i] = costMatrix[i] - min(costMatrix[i])

    step = 2


def __step2__():
    # Find a zero (Z) in the resulting matrix.  If there is no starred zero in its row or column, star Z. Repeat for
    # each element in the matrix. Go to Step 3.
    global step, maskMatrix, costMatrix

    assignedCols = np.zeros(m)
    assignedRows = np.zeros(n)

    for i in range(n):
        for j in range(m):
            if costMatrix[i][j] == 0 and assignedCols[j] == 0 and assignedRows[i] == 0:
                # Determine if there are no other starred zeros in its row or column
                maskMatrix[i][j] = 1
                assignedCols[j] = 1
                assignedRows[i] = 1

    step = 3


def __step3__():
    # Cover each column containing a starred zero.  If K columns are covered, the starred zeros describe a complete set
    # of unique assignments.  In this case, Go to DONE, otherwise, Go to Step 4.
    global step, maskMatrix, coveredCols

    count = 0
    for i in range(m):
        if 1 in maskMatrix.T[i]:
            count += 1
            coveredCols[i] = 1

    if count >= n or count >= m:
        step = 100
        global solved
        solved = True
    else:
        step = 4


def __step4__():
    # Find a noncovered zero and prime it.  If there is no starred zero in the row containing this primed zero,
    # Go to Step 5.  Otherwise, cover this row and uncover the column containing the starred zero.
    # Continue in this manner until there are no uncovered zeros left. Save the smallest uncovered value and
    # Go to Step 6.
    global step, costMatrix, maskMatrix, smallestUncovered

    smallestUncovered = costMatrix[0][0]
    for i in range(n):
        for j in range(m):
            if costMatrix[i][j] == 0 and coveredCols[j] == 0 and coveredRows[i] == 0:
                maskMatrix[i][j] = 2
                if 1 not in maskMatrix[i]:
                    step = 5
                else:
                    coveredRows[i] = 1
                    coveredCols[np.nonzero(maskMatrix[i] == 1)[0][0]] = 0
                    smallestUncovered = min(costMatrix[i][j], smallestUncovered)

    # No uncovered zeros left
    step = 6




def __step5__():
    pass


def __step6__():
    pass


def __logFinalResult__(rownames, colnames):
    global maskMatrix, originalMatrix
    global inputN, inputM

    resultPairs = {}
    for i in range(inputN):
        for j in range(inputM):
            if maskMatrix[i][j] == 1:
                resultPairs[rownames[i]] = colnames[j]

    print('=========================')
    print('The optimum assignment has be found.')
    print()
    for i in range(len(resultPairs)):
        print(rownames[i] + " -> " + resultPairs[rownames[i]])


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
    [5, 3, 4, 2, 1],
    [3, 2, 4, 5, 1],
    [3, 1, 5, 2, 4],
    [4, 3, 1, 2, 5]
]

minimise(testData, ["John", "Paul", "Lily", "Chris"],
         ["Wash Windows", "Clean Car", "Brush Floor", "Take out bins", "Mop"])
