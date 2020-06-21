from backend import app
from flask import jsonify


@app.route("/")
def home():
    return "Hello World"
