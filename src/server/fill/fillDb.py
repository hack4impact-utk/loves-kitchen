"""
If you want to debug this file, check where I call the "print_all"
function in main() for convenient access to the generated volunteers 
and sessions.
"""

import pymongo
from datetime import datetime
import random
import names
import time
from faker import Faker  # Import Faker for address and phone number generation

fake = Faker()  # Initialize Faker instance

def random_datetime(start, end, time_format, prop):
    """Generate a random datetime between start and end."""
    stime = time.mktime(time.strptime(start, time_format))
    etime = time.mktime(time.strptime(end, time_format))
    ptime = stime + prop * (etime - stime)
    struct = time.localtime(ptime)
    return datetime.fromtimestamp(time.mktime(struct))

def generate_flags():
    """
    Randomly generate flags for a volunteer.
    Uses probabilities to assign 0, 1, or 2 flags randomly.
    """
    PROBABILITIES = [.3, .1]  # 30% chance for 1 flag, 10% chance for 2 flags
    FLAG_MSGS = {
        "gray": ["No flags yet.", "Just chilling.", "Everything is fine."],
        "red": ["Too many unpaid hours.", "Volunteered too much, needs a break.", "Late for the third time this week!"],
        "orange": ["Great volunteer, but could be more punctual.", "Has been doing well, but needs improvement."],
        "green": ["A true hero!", "Always early, always helpful.", "Best volunteer we have!"]
    }
    RANDOM_FLOAT = random.random()

    # Check for 1 flag
    if RANDOM_FLOAT < PROBABILITIES[0]:
        color = random.choice(["gray", "red", "orange", "green"])
        description = random.choice(FLAG_MSGS[color])
        return [{"color": color, "description": description}]

    # Check for 2 flags
    elif RANDOM_FLOAT < (PROBABILITIES[0] + PROBABILITIES[1]):
        color1, color2 = random.sample(["gray", "red", "orange", "green"], 2)
        return [
            {"color": color1, "description": random.choice(FLAG_MSGS[color1])},
            {"color": color2, "description": random.choice(FLAG_MSGS[color2])}
        ]

    return []  # No flags assigned


def main():
    print("Trying to connect to local MongoDB database...")
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["dummy_base"]

    # **Updated collection name to "volunteers" instead of "vols"**
    volunteer_col = mydb["volunteers"]
    session_col = mydb["sessions"]

    print("Successfully connected! Generating volunteers...")

    volunteers = {}
    sessions = {}

    while len(volunteers) != 50:
        first_name = names.get_first_name()
        last_name = names.get_last_name()

        # Create unique email in the required format
        email = f"{first_name.lower()}{last_name.lower()}@example.com"
        ctr = 0
        while email in volunteers:
            email = f"{first_name.lower()}{last_name.lower()}{ctr}@example.com"
            ctr += 1

        # Generate authid, age, creation date, and flags
        authID = f"{email.split('@')[0]}.id"
        age = random.randint(16, 75)
        createdAt = random_datetime("4/16/2004 1:30 PM", "10/13/2024 4:50 AM", '%m/%d/%Y %I:%M %p', random.random())

        # Use Faker to generate phone number and address
        phone = str(random.randint(1000000000, 9999999999))
        address = fake.address()

        # Store volunteer data in the dictionary
        volunteers[authID] = {
            "checked_in": False,
            "is_staff": False,
            "authID": authID,
            "firstName": first_name,
            "lastName": last_name,
            "age": age,
            "email": email,
            "phone": phone,
            "address": address,
            "createdAt": createdAt,
            "flags": generate_flags(),  # Randomly generated flags
        }

    print("Volunteers generated, creating sessions...")

    # Create 1-3 sessions per volunteer
    for authID in volunteers:
        num_sessions = random.randint(1, 3)
        createdAtStr = volunteers[authID]["createdAt"].strftime('%m/%d/%Y %I:%M %p')

        for i in range(num_sessions):
            length = random.randint(1, 16) / 2  # Half-hour intervals
            startAnyTime = random_datetime(createdAtStr, "10/13/2024 4:50 AM", '%m/%d/%Y %I:%M %p', random.random())
            satDate = startAnyTime.strftime('%m/%d/%Y')
            startWorkTime = random_datetime(f"{satDate} 07:00 AM", f"{satDate} 05:00 PM", '%m/%d/%Y %I:%M %p', random.random())

            if i == 0:
                sessions[authID] = []
            
            sessions[authID].append({
                "workedBy": authID,
                "length": length,
                "startTime": startWorkTime,
                "checked_out": True
            })

    print("Successfully generated sessions, adding data to database...")

    # Insert volunteers into "volunteers" collection
    volunteer_col.insert_many(volunteers.values())

    # Insert sessions into "sessions" collection
    for email in sessions:
        session_col.insert_many(sessions[email])

    print("Successfully populated the database! Quitting...")


if __name__ == "__main__":
    main()
