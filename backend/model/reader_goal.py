from backend import db
from sqlalchemy import CheckConstraint


class ReaderGoal(db.Model):
    reader_id = db.Column(
        db.Integer, db.ForeignKey("reader.id", ondelete="CASCADE"), primary_key=True,
    )
    month = db.Column(
        "month",
        db.Integer,
        CheckConstraint("1 <= month"),
        CheckConstraint("month <= 12"),
        primary_key=True,
    )
    year = db.Column("year", db.Integer, CheckConstraint("year >= 0"), primary_key=True)
    goal = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        return f"<ReaderGoal(reader_id='{self.reader_id}', month='{self.month}', year='{self.year}', goal='{self.goal}')>"
