from django.db import models
from django.contrib.auth.models import User
# Create your models here.
from publisher.models import LabelTasksBaseInfo


class TempLabel(models.Model):
    task = models.ForeignKey(LabelTasksBaseInfo, on_delete=models.CASCADE)
    labeler = models.ForeignKey(User, on_delete=models.CASCADE)
    label = models.TextField()
    objects=models.Manager()

class TempSalaryLog(models.Model):
    task = models.ForeignKey(LabelTasksBaseInfo, on_delete=models.CASCADE)
    labeler = models.ForeignKey(User, on_delete=models.CASCADE)
    salary = models.FloatField(default=0)
    log = models.TextField()
    objects=models.Manager()

class TempTaskLog(models.Model):
    task = models.ForeignKey(LabelTasksBaseInfo, on_delete=models.CASCADE)
    labeler = models.ForeignKey(User, on_delete=models.CASCADE)
    log = models.TextField()
    objects = models.Manager()

