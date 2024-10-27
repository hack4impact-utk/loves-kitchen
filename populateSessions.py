import pymongo
from datetime import datetime
import time
import random

names = ['Marquita Novak','Jacklyn Bryant','Selena Hansen','Darnell Daugherty','Staci Church','Antione Lopez',
'Odell Solomon','Latonya Burgess','Maritza Hodges','Keri Ortiz','Hope Osborne','Lena Wolf','Lonny Winters',
'Juliette Perry','Foster Jacobson','Suzanne Irwin','Gale Ortega','Doris Strong','Chester Mendoza','Celia Fox',
'Marian Hill','Rosalind Maxwell','Cheryl Garza','Rod Small','Kennith Oneill','Alyssa Houston','Ruben Palmer',
'Michael Levine','Leta Cameron','Bettie Mcconnell','Royal Tapia','Cassandra Chase','Wayne French','Lou Odom',
'Heather Stanton','Lelia Camacho','Jame Carney','Royce Vincent','Tammie Hurley','Maribel Hanna','Bradford Avila',
'Kerry Greene','Leona Leach','Joe Briggs','Louella Hall','Dallas Ray','Marina Oliver','Marcy Montoya','Raymond Wells',
'Kerry Flores']



#same database, an additional collection
#keep track of the volunteers you added
#session as in how long a volunteer worked for
#data duplicates if script is ran twice, error check if script has already been ran

startSession = []
for i in names: #random start time, for testing
  startHour = random.randint(10, 12)
  startMinute = random.randint(0, 59)
  startTime = f"{startHour}:{startMinute}"
  startSession.append(startTime)

totalSession = []
for i in names:  #random total time
  totalTime = random.randint(0,8)
  totalSession.append(totalTime)


myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["dummy_base"]
mycol = mydb["vols"]


document = [
    {"name": name, "Start Time": startTime, "Total Time": totalTime}
    for name, startTime, totalTime in zip(names, startSession, totalSession) #binds each array at index i to each other
]

if((mycol.find_one() == None) or (document[0]["name"] != mycol.find_one()["name"])): #runs if empty or if first index doesnt equal each other
    mycol.insert_many(document)






