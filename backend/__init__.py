from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from backend.config import Config
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(db)
ma = Marshmallow(app)

from backend import routes
