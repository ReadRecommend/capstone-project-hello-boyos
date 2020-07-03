import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = (
        os.getenv("SECRET_KEY") or b"\x06!~\x8c5\x8d\xe8g\x13B\xba\xf2\x1d\xc8\x1d\xa0"
    )
    SQLALCHEMY_DATABASE_URI = (
        os.getenv("DATABASE_URL") or "postgresql://postgres:test123@localhost/test"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_HEADERS = "Content-Type"
    JWT_ACCESS_LIFESPAN = os.getenv("JWT_ACCESS_LIFESPAN") or {"minutes": 15}
    JWT_REFRESH_LIFESPAN = os.getenv("JWT_REFRESH_LIFESPAN") or {"days": 7}
    JWT_COOKIE_NAME = os.getenv("JWT_COOKIE_NAME") or "accessToken"
    JWT_PLACES = os.getenv("JWT_PLACES") or ["cookie"]
