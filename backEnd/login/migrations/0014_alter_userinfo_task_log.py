# Generated by Django 4.0.3 on 2022-06-09 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0013_alter_userinfo_task_log'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userinfo',
            name='task_log',
            field=models.TextField(default="{'TaskID': {}, 'BatchID': {}, 'TaskName': {}, 'DataType': {}, 'Process': {}, 'LastTime': {}, 'Deadline': {}}"),
        ),
    ]
