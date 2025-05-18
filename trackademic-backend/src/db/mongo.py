from pymongo import MongoClient

MONGO_URI = "mongodb+srv://rony:teamorony@clustertrackademic.mxuottc.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTrackademic"

client = MongoClient(MONGO_URI)

db = client["trackademic"]
