from django.db import models
from django.contrib.auth.models import User
import pandas as pd

class UserInfo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    salary = models.FloatField()
    ability = models.IntegerField()
    user_type_choice = (
        ("Publisher", "publisher"),("Labeler", "labeler"),("Manager", "manager")
    )
    user_type = models.CharField(max_length=50, choices=user_type_choice)
    salary_log = models.TextField(default=str(pd.DataFrame(columns=["TaskName", "ItemID", "Time", "Payment", "State"]).to_dict()))



