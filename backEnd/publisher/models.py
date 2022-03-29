from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class LabelTasksBaseInfo(models.Model):
    # 具体的数据文件不会放在这个表里面
    # 防止在做一些基础数据的查询时速度过慢
    publisher = models.ForeignKey(User, on_delete=models.CASCADE)
    task_name = models.CharField(max_length=50)
    data_type = models.CharField(max_length=10)
    label_type = models.CharField(max_length=10)
    task_deadline = models.DateTimeField()
    task_payment = models.IntegerField()
    rule_file = models.TextField(max_length=500)
    task_difficulty = models.CharField(max_length=50)
    inspect_method = models.CharField(max_length=10, default="cross")
    test = models.CharField(max_length=10, default="")

    def __str__(self):
        return self.task_name

class LabelTaskFile(models.Model):
    # 通过外键与BaseInfo关联，级联删除
    task_id = models.ForeignKey(LabelTasksBaseInfo, on_delete=models.CASCADE)
    data_file = models.TextField()




