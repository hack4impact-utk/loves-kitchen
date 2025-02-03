# Filling Your Local MongoDB Server

This short python script will quickly add 50 different volunteers to your database. However,
as we expand on the definition of a user in this project, this script will likely change.

If you do use this script, make sure your env has this variable:

```
MONGODB_URI="mongodb://127.0.0.1:27017/database_name"
```

## Getting Set Up

Follow this tutorial for setting up a local MondoDB server:
https://www.prisma.io/dataguide/mongodb/setting-up-a-local-mongodb-database#setting-up-mongodb-on-windows

As for running the python script, you may have to install Anaconda. This is a package manager
for python and makes importing packages super easy! If you are a computer science major, you'll
likely need it in future computer science classes. Here's the download link:
https://www.anaconda.com/download

Once you install Anaconda, you can run the Anaconda Prompt and install a few packages, Anaconda
might come with them by default:

```
pip install pymongo names
```

> [!WARNING]
> Make you sure enter `python fillDb.py` instead of `py fillDb.py` to run the program. Packages will not
> be imported properly otherwise.
