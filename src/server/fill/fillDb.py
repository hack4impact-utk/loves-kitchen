"""
If you want to debug this file, check where I call the "print_all"
function in main() for convenient access to the generated volunteers 
and sessions
"""

import pymongo
from datetime import datetime
import random
import names
import time


def print_all(vols, seshs):
    """
    Prints all the volunteers and sessions for debugging purposes.
    """
    for email in vols:
        print(f"\n\nName: {vols[email]["name"]}")
        print(f"Email: {vols[email]["email"]}")
        print(f"Age: {vols[email]["age"]}")
        print(f"Created At: {vols[email]["createdAt"].strftime('%m/%d/%Y %I:%M %p')}")


    for email in seshs:
        print(f"\n\nEmail: {vols[email]["email"]}")
        for i in range(len(seshs[email])):
            print(f"[{i}]: {seshs[email][i]["length"]} hours at {seshs[email][i]["startTime"].strftime('%m/%d/%Y %I:%M %p')}")


def random_datetime(start, end, time_format, prop):
    """Get a time at a proportion of a range of two formatted times.

    start and end should be strings specifying times formatted in the
    given format (strftime-style), giving an interval [start, end].
    prop specifies how a proportion of the interval to be taken after
    start.  The returned time will be in the specified format.
    """

    stime = time.mktime(time.strptime(start, time_format))
    etime = time.mktime(time.strptime(end, time_format))

    ptime = stime + prop * (etime - stime)
    struct = time.localtime(ptime)

    return datetime.fromtimestamp(time.mktime(struct))


def main():
    print("Trying to connect to local MongoDB database...")
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["dummy_base"]
    usercol = mydb["vols"]
    seshcol = mydb["sessions"]
    print("Successfully connected! Generating volunteers...")

    vols = {}
    seshs = {}


    # create volunteer dictionary
    while len(vols) != 50:
        name = names.get_first_name() + ' ' + names.get_last_name()

        # create unique email
        email = f"{name.lower().replace(' ', '.')}@gmail.com"
        ctr = 0
        while email in vols:
            email = f"{name.lower().replace(' ', '.')}{ctr}@gmail.com"
            ctr += 1

        # create trivial values
        age = random.randint(16,75)
        createdAt = random_datetime("4/16/2004 1:30 PM", "10/13/2024 4:50 AM", '%m/%d/%Y %I:%M %p', random.random())
        vols[email] = {
            "name": name,
            "age": age,
            "email": email,
            "createdAt": createdAt
        }

    print("Volunteers generated, creating sessions...")


    # create 1-3 sessions per volunteer
    # sessions must be AFTER the creation of the 
    for email in vols:
        numSesh = random.randint(1,3)
        createdAtStr = vols[email]["createdAt"].strftime('%m/%d/%Y %I:%M %p')
        for i in range(numSesh):
            length = random.randint(1, 16) / 2
            startAnyTime = random_datetime(createdAtStr, "10/13/2024 4:50 AM", '%m/%d/%Y %I:%M %p', random.random())
            satDate = startAnyTime.strftime('%m/%d/%Y')
            startWorkTime = random_datetime(f"{satDate} 07:00 AM", f"{satDate} 05:00 PM", '%m/%d/%Y %I:%M %p', random.random())
            if i == 0:
                seshs[email] = []
            seshs[email].append({
                "email": email,
                "length": length,
                "startTime": startWorkTime
            })

    print("Successfully generated sessions, adding data to database...")


    # print_all(vols, seshs)
    usercol.insert_many(vols.values())
    for email in seshs:
        seshcol.insert_many(seshs[email])

    print("Successfully populated the database! Quitting...")
    

if __name__ == "__main__":
    main()