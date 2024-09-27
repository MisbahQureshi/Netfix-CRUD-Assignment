from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB Atlas connection string
client = MongoClient("mongodb+srv://username:password@cluster0.ovad4.mongodb.net/")
db = client['database']
collection = db['netflixes']

@app.route('/')
def index():
    return "Connected to MongoDB!"

if __name__ == '__main__':
    app.run(debug=True)
