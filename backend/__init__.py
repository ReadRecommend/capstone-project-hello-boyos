import os

from flask import Flask
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

from backend.config import Config

app = Flask(__name__)
app.config.from_object(Config)
cors = CORS(app)

db = SQLAlchemy(app)
ma = Marshmallow(app)

from backend import routes
