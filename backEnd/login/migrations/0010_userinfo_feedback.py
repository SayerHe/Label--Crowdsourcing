# Generated by Django 4.0.3 on 2022-06-09 02:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0009_alter_userinfo_ability'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinfo',
            name='feedback',
            field=models.TextField(default="{'TaskID': {}, 'TaskName': {}, 'Priority': {}, 'State': {}, 'UpdatedTime': {}}"),
        ),
    ]
