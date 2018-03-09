from random import randint
from datetime import datetime
from datetime import date
# from datetime import date
from datetime import timedelta
# Deciding the number of columns and the number of rows in the csv_list
cols = 5
rows = 100
# The max y
max_y = 200
base = date(datetime.today().year, datetime.today().month, datetime.today().day)
date_list = [base + timedelta(days=x) for x in range(0, rows)]
x = list(map(lambda x: x.isoformat(), date_list))
f = open('data.csv', 'w')
csv_list = [[x[j] if i == 0 else randint(0, max_y) for i in range(cols)]
            for j in range(rows)]

print("date," + ",".join(chr(97 + i) for i in range(cols - 1)), file=f)

print(",".join(str(i) for i in csv_list).replace("]", "\n").replace(",[", "").replace("[", "").replace("'", ""),end="",file=f)
f.close()