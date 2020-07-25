from flask import Flask
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_praetorian import Praetorian

from backend.config import Config

app = Flask(__name__)
app.config.from_object(Config)
cors = CORS(app, supports_credentials=True)

db = SQLAlchemy(app)
ma = Marshmallow(app)

from backend.model.reader import Reader

guard = Praetorian(app, user_class=Reader)

# Register blueprints
from backend.auth import auth_bp
from backend.book import book_bp
from backend.user import user_bp
from backend.collection import collection_bp
from backend.search import search_bp
from backend.goals import goals_bp

app.register_blueprint(auth_bp)
app.register_blueprint(book_bp)
app.register_blueprint(user_bp)
app.register_blueprint(collection_bp)
app.register_blueprint(search_bp)
app.register_blueprint(goals_bp)

from backend import routes
