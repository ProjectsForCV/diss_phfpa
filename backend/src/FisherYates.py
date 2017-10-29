import random
def shuffle(arr) :
    for x in range(0, len(arr) - 2):
        j = random.randint(0, len(arr) -1 )
        arr[x] = arr[j]


data = [1,2,3,4,5,6,7,8,9]
shuffle(data)
print(data)