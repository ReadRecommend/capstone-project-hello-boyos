from backend import db

followers = db.Table(
    "followers",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("follower_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
)
