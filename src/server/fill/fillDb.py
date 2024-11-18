import pymongo
from datetime import datetime
import random
import names

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["dummy_base"]
usercol = mydb["users"]
sesh = mydb["sessions"]

firstNamesArr = []
lastNamesArr = []
ages = []
emails = []
elapsed = []
times = []
for i in range(100):
    Fname = names.get_first_name()
    firstNamesArr.append(Fname)

    Lname = names.get_last_name()
    lastNamesArr.append(Lname)

    age = random.randint(16,75)
    ages.append(age)

    email = "%s.%s@gmail.com" % (firstNamesArr[i].lower(), lastNamesArr[i].lower())
    emails.append(email)

    startTime = datetime.now()
    times.append(startTime)

    hours = random.uniform(0.5, 8.0)
    hours = round(hours * 2) / 2     #rounds to half hours
    elapsed.append(hours)

#after populating arrays, bind everything together for 2 collections

people = [
    {"name": f"{Fname} {Lname}", "age": age, "email": email, "CreatedAt":startTime}
    for Fname, Lname, age, email, startTime in zip(firstNamesArr, lastNamesArr, ages, emails, times) #binds each array at index i to each other
]
seshbind = [
    {"name": f"{Fname} {Lname}", "Start Time":startTime, "Shift length":hours}
    for Fname, Lname, startTime, hours in zip(firstNamesArr, lastNamesArr, times, elapsed) #binds each array at index i to each other
]

if((usercol.find_one() == None) or (people[0]["name"] != usercol.find_one()["name"])): #runs if empty or if first index doesnt equal each other
    usercol.insert_many(people)
    sesh.insert_many(seshbind)