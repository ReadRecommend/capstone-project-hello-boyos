import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "A32C30240F4E3248A6A447C71E81785A")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "postgresql://postgres:test123@localhost/test"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_HEADERS = "Content-Type"
    JWT_ACCESS_LIFESPAN = {"minutes": int(os.getenv("JWT_ACCESS_MINUTES", "30"))}
    JWT_REFRESH_LIFESPAN = {"days": int(os.getenv("JWT_REFRESH_DAYS", "7"))}
    JWT_COOKIE_NAME = "accessToken"
    JWT_PLACES = os.getenv("JWT_PLACES", "cookie,header").split(",")
