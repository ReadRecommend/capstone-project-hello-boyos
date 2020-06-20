from flask import Flask
from flask_app.config import Config

app = Flask(__name__)
app.config.from_object(Config)

from flask_app import routes
