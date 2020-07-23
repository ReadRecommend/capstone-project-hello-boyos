from backend import db
from sqlalchemy import CheckConstraint


class ReaderGoal(db.Model):
    reader_id = db.Column(db.Integer, db.ForeignKey("reader.id"), primary_key=True)
    month = db.Column(
        "month",
        db.Integer,
        CheckConstraint("1 <= month"),
        CheckConstraint("month <= 12"),
        primary_key=True,
    )
    year = db.Column("year", db.Integer, CheckConstraint("year >= 0"), primary_key=True)
    goal = db.Column(db.Integer, nullable=True)
    n_read = db.Column(db.Integer, default=0, nullable=False)

    def __repr__(self):
        return f"<ReaderGoal(reader_id='{self.reader_id}', month='{self.month}', year='{self.year}', goal='{self.goal}', n_read='{self.n_read}')>"
