import json
from random import randint

import numpy as np
import sys


"""This script will be called by the server using command line arguments where: 
    
    argv[1] - rows
    argv[2] - cols
"""

rows = int(sys.argv[1])
cols = int(sys.argv[2])
min = 1
max = 20


a = np.zeros((rows,cols), np.uint16)

for i in range(rows):
    rowvals = np.zeros(max + 1, np.uint16)
    for j in range(cols):
        same = True
        while(same):
            v = randint(min, max)
            if rowvals[v] == 1:
                continue
            else:
                a[i][j] = v
                rowvals[v] = 1
                same = False
#convert to regular list for json transmission
matrix = a.tolist()
print(matrix)
sys.stdout.flush()