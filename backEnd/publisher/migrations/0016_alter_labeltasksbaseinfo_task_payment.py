# Generated by Django 4.0.3 on 2022-06-09 11:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0015_labeltaskfile_labelers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labeltasksbaseinfo',
            name='task_payment',
            field=models.FloatField(),
        ),
    ]
