# Generated by Django 4.0.3 on 2022-06-09 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0013_labeltasksbaseinfo_batch_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='labeltaskfile',
            name='sample',
        ),
        migrations.RemoveField(
            model_name='labeltasksbaseinfo',
            name='batch_id',
        ),
        migrations.RemoveField(
            model_name='labeltasksbaseinfo',
            name='total_task_id',
        ),
        migrations.AddField(
            model_name='labeltaskfile',
            name='batch_id',
            field=models.IntegerField(default=-1),
        ),
        migrations.AddField(
            model_name='labeltasksbaseinfo',
            name='sample',
            field=models.TextField(default="{'Index': {}, 'Label': {}}"),
        ),
    ]
