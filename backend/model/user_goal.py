from backend import db


class UserGoal(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    goal = db.Column(db.Integer, nullable=False)

    # TODO: Month + Association

    def __repr__(self):
        return f"<UserGoal(user_id='{self.user_id}', goal='{self.goal}')>"
