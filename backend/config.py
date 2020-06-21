import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = (
        os.environ.get("SECRET_KEY")
        or b"\x06!~\x8c5\x8d\xe8g\x13B\xba\xf2\x1d\xc8\x1d\xa0"
    )
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get("DATABASE_URL") or "postgresql://postgres:test123@localhost/test"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
