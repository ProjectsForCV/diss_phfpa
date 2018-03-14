import csv
import sys

path = sys.argv[1]


with open(path, 'r') as csvfile:
    csvrows = csv.reader(csvfile, delimiter=',')

    for row in csvrows:
        for item in row:
            if "@" not in item:
                continue
            else:
                print(item)

    exit(0)


