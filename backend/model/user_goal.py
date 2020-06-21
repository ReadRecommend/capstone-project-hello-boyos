from backend import db


class ReaderGoal(db.Model):
    reader_id = db.Column(db.Integer, primary_key=True)
    goal = db.Column(db.Integer, nullable=False)

    # TODO: Month + Association

    def __repr__(self):
        return f"<ReaderGoal(reader_id='{self.reader_id}', goal='{self.goal}')>"
