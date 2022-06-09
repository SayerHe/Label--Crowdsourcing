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
    task_log = models.TextField(default=str(pd.DataFrame(columns=["TaskID", "TaskName", "DataType", "ItemNum", "LastTime", "TaskState"]).to_dict()))
    objects=models.Manager()
    feedback = models.TextField(default=str(pd.DataFrame(columns=["TaskID", "TaskName", "Priority", "State", "UpdatedTime"]).to_dict()))

# 任务号，任务名称，任务类型，标注条数，操作时间，任务状态，操作（继续标注）
