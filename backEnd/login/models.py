from django.db import models
from django.contrib.auth.models import User
import pandas as pd

class UserInfo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    salary = models.FloatField(default=0)
    undetermined = models.FloatField(default=0)
    ability = models.FloatField()
    user_type_choice = (
        ("Publisher", "publisher"),("Labeler", "labeler"),("Manager", "manager")
    )
    user_type = models.CharField(max_length=50, choices=user_type_choice)
    salary_log = models.TextField(default=str(pd.DataFrame(columns=["TaskID", "TaskName", "ItemID", "Time", "Payment", "State"]).to_dict()))
    task_log = models.TextField(default=str(pd.DataFrame(columns=["TaskID", "BatchID", "TaskName", "DataType", "Progress", "LastTime", "Deadline"]).to_dict()))
    objects=models.Manager()
    feedback_file = models.TextField(default=str(pd.DataFrame(columns=["TaskID","TaskName","State", "ProblemDescription", "ProblemType","Priority", "ProblemDetails", "UpdatedTime"]).to_dict()))


