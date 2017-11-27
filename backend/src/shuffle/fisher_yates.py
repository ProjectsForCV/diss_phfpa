import random

def shuffle(arr) :
    scratch = arr[:]
    arr.clear()
    for x in range(len(scratch) - 1, -1, -1):
        j = random.randint(0, x )
        arr.append(scratch.pop(j))

