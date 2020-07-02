import os

from flask import Flask
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from flask_praetorian import Praetorian

from backend.config import Config

app = Flask(__name__)
app.config.from_object(Config)
cors = CORS(app, supports_credentials=True)

db = SQLAlchemy(app)
ma = Marshmallow(app)

from backend.model.reader import Reader

guard = Praetorian(app, user_class=Reader)

from backend import routes
