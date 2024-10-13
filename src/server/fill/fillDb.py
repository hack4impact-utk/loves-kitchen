import pymongo
from datetime import datetime
import time
import random
import pandas as pd


# Random time selector function
# adapted from here: https://stackoverflow.com/questions/553303/how-to-generate-a-random-date-between-two-other-dates
def random_time(start, end, time_format, prop):
    """Get a time at a proportion of a range of two formatted times.

    start and end should be strings specifying times formatted in the
    given format (strftime-style), giving an interval [start, end].
    prop specifies how a proportion of the interval to be taken after
    start.  The returned time will be in the specified format.
    """

    stime = time.mktime(time.strptime(start, time_format))
    etime = time.mktime(time.strptime(end, time_format))

    ptime = stime + prop * (etime - stime)

    return time.localtime(ptime)


if __name__ == "__main__":
    # establish connection
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["dummy_base"]
    mycol = mydb["vols"]

    # read csv
    fileData = pd.read_csv("dummy.csv")

    for i in range(len(fileData.index)):
        struct = random_time("4/16/2004 1:30 PM", "10/13/2024 4:50 AM", '%m/%d/%Y %I:%M %p', random.random())
        dt = datetime.fromtimestamp(time.mktime(struct))
        mycol.insert_one({"name": fileData.iloc[i]["name"], "age": fileData.iloc[i]["age"].item(), "createdAt": dt})