# Generated by Django 4.0.3 on 2022-06-05 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0007_remove_userinfo_label_log_userinfo_salary_log_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinfo',
            name='undetermined',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='salary',
            field=models.FloatField(default=0),
        ),
    ]
