from backend import db

followers = db.Table(
    "followers",
    db.Column("reader_id", db.Integer, db.ForeignKey("reader.id"), primary_key=True),
    db.Column("follower_id", db.Integer, db.ForeignKey("reader.id"), primary_key=True),
)
