from flask import Flask

from backend.config import Config
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
ma = Marshmallow(app)

# Refresh database every time
from backend.database.json_to_db import json_to_db
import os

db.drop_all()
db.create_all()
json_to_db(os.path.abspath(os.environ.get("INITIAL_DATA", "books.json")))

from backend import routes
