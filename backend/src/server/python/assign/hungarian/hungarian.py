#   Filename: hungarian.py
#   Description: This is an implementation of the munkres assignment algorithm, a.k.a the hungarian algorithm
#   Author: Daniel Cooke
import ast
import json

import numpy as np
import sys


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

# We must store the uncovered prime zero from step 4
uncoveredPrimedZeroRow, uncoveredPrimedZeroCol = 0, 0

"""Returns the lowest cost assignment solution for matrix m (n by m)"""


def minimise(mat, rownames = -1, colnames = -1):
    global costMatrix, maskMatrix, originalMatrix
    global n, m, step, inputM, inputN
    global coveredCols, coveredRows, smallestUncovered



    # Get dimensions of input matrix
    inputN = len(mat)
    inputM = len(mat[0])

    # Make sure matrix has as many rows as columns by appending dummy rows if necessary
    if inputN < inputM:
        diff = inputM - inputN
        while (diff > 0):
            a = np.full(inputM, 9999, np.uint16)
            mat.append(a)
            diff -= 1

    # Update real dimensions after potential dummy rows
    n = len(mat)
    m = len(mat[0])

    # Set up various matrices
    costMatrix = __createNumpyArray__(mat)
    maskMatrix = np.zeros((n, m), np.int8)
    originalMatrix = mat

    # Assign covered rows and covered columns memory space
    coveredRows = np.zeros(n, np.int8)
    coveredCols = np.zeros(m, np.int8)

    iter = 0


    while not solved:


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



    return maskMatrix

def __buildOutputString__(mat):
    return json.dumps(mat)

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

    assignedCols = np.zeros(m, np.uint8)
    assignedRows = np.zeros(n, np.uint8)

    for i in range(n):
        for j in range(m):
            if costMatrix[i][j] == 0 and assignedCols[j] == 0 and assignedRows[i] == 0:
                # Determine if there are no other starred zeros in its row or column
                maskMatrix[i][j] = 1
                assignedCols[j] = 1
                assignedRows[i] = 1
                continue

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
    global step, costMatrix, maskMatrix, smallestUncovered, uncoveredPrimedZeroRow, uncoveredPrimedZeroCol
    global coveredCols, coveredRows

    for i in range(n):
        for j in range(m):
            # Find a non covered zero and prime it
            if costMatrix[i][j] == 0 and coveredCols[j] == 0 and coveredRows[i] == 0:

                # Prime the uncovered zero
                maskMatrix[i][j] = 2

                # If there is no starred zero in the row go to step 5
                if __findStarInRow__(i) < 0:
                    step = 5
                    uncoveredPrimedZeroRow = i
                    uncoveredPrimedZeroCol = j
                    return
                else:
                    # There IS a starred zero, cover this row
                    coveredRows[i] = 1

                    # Uncover the column containing the starred zero
                    coveredCols[__findStarInRow__(i)] = 0



    # No uncovered zeros left
    step = 6


def __augmentSeries__(series):
    # A helper method to augment the series of alternating primed/starred zeroes from step 5.
    # It will perform the following :
    # Unstar each starred zero of the series, star each primed zero of the series
    for i in range(len(series)):
        if i%2 == 0:
            # star this prime in the mask matrix
            maskMatrix[series[i]['row'], series[i]['col']] = 1
        else:
            # unstar the star
            maskMatrix[series[i]['row'], series[i]['col']] = 0


def __uncoverLines__():
    for i in range(len(coveredCols)):
        coveredCols[i] = 0
        coveredRows[i] = 0


def __emptyPrimes__():
    for i in range(n):
        for j in range(m):
            if maskMatrix[i][j] == 2:
                maskMatrix[i][j] = 0


def __step5__():
    # Construct a series of alternating primed and starred zeros as follows.  Let Z0 represent the uncovered primed
    # zero found in Step 4.  Let Z1 denote the starred zero in the column of Z0 (if any).
    # Let Z2 denote the primed zero in the row of Z1 (there will always be one).
    # Continue until the series terminates at a primed zero that has no starred zero in its column.
    # Unstar each starred zero of the series, star each primed zero of the series, erase all primes and uncover every
    # line in the matrix.  Return to Step 3.


    series = []
    done = False
    # First entry in the series is Z0, the uncovered prime from step 4
    series.append({'row' : uncoveredPrimedZeroRow, 'col' : uncoveredPrimedZeroCol})

    while not done:
        c = series[len(series) - 1]['col']
        # Find a starred zero in the column of the last primed zero
        r = __findStarInCol__(c)


        if r > -1:
            # Add this starred zero to the series
            series.append({'row': r, 'col': c })
        else:
            # If there is no star in this column we are done
            done = True

        if not done:
            # Continue by adding another primed zero from the row of the last starred zero
            c = __findPrimeInRow__(r)
            series.append({'row': r, 'col': c})

    __augmentSeries__(series)
    __uncoverLines__()
    __emptyPrimes__()
    global step
    step = 3



def __step6__():
    # Add the value found in Step 4 to every element of each covered row, and subtract it from every element of
    # each uncovered column.  Return to Step 4 without altering any stars, primes, or covered lines.
    global step
    smallestUncovered = __findSmallestUncoveredVal__()

    for i in range(n):
        for j in range(m):

            if coveredRows[i] == 1:
                costMatrix[i, j] += smallestUncovered

            if coveredCols[j] == 0:
                costMatrix[i, j] -= smallestUncovered

    step = 4

def __findSmallestUncoveredVal__():
    min = sys.maxsize
    for i in range(n):
        for j in range(m):
            if costMatrix[i,j] < min and coveredRows[i] == 0 and coveredCols[j] == 0:
                min = costMatrix[i,j]
    return min
def __findStarInCol__(col):
    r = -1
    for i in range(n):
        if maskMatrix[i, col] == 1:
            r = i

    return r

def __findStarInRow__(row):
    c = -1
    for i in range(m):
        if maskMatrix[row,i] == 1:
            c = i
    return c
def __findPrimeInRow__(row):
    c = -1
    for i in range(m):
        if maskMatrix[row, i] == 2:
            c = i
    return c

def __logFinalResult__(rownames, colnames):
    global maskMatrix, originalMatrix
    global inputN, inputM

    resultPairs = {}
    for i in range(inputN):
        for j in range(inputM):
            if maskMatrix[i][j] == 1:
                if rownames != -1 and colnames != -1:
                    resultPairs[rownames[i]] = colnames[j]
                else:
                    resultPairs[i] = j

    if rownames != -1 and colnames != -1:
        for key in resultPairs:
                print(key + "\t" + resultPairs[key] )
    else:
        for i in range(len(resultPairs)):
            print(str(i) + "\t" + str(resultPairs[i]))


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


matrix = ast.literal_eval(sys.argv[1])
if(len(sys.argv) > 2):

    rows = sys.argv[2].split(',')
    cols = sys.argv[3].split(',')
    minimise(matrix, rows, cols)
    __logFinalResult__(rows, cols)
else:
    print(__buildOutputString__(minimise(matrix).tolist()))
