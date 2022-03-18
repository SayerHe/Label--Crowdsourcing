from django.db import models

# Create your models here.

class mysql_test(models.Model):
    test = models.CharField(max_length=100)

