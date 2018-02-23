from random import randint
import datetime
# Deciding the number of columns and the number of rows in the csv_list
cols = 5
rows = 100
# The max y
max_y = 200
base = datetime.datetime.today()
date_list = [base - datetime.timedelta(days=x) for x in range(0, rows)]
print(date_list[47])
f = open('data.csv', 'w')
csv_list = [[j if i == 0 else randint(0, max_y) for i in range(cols)]
            for j in range(rows)]

print("date," + ",".join(chr(97 + i) for i in range(cols - 1)), file=f)

print(",".join(str(i)for i in csv_list).replace("]", "\n").replace(",[", "").replace("[", ""),end="",file=f)
f.close()

# I need to restructure how as in to read time as well
# I need to need to then figure out how to have a time axis (D3JS)
# I then need to figure out how to have tags on each of the labels
# I need to figure out how to colour underneath the graph
# submit to Git
# custom designed axes
# Do the design Specification for the project
# Go To Bed then