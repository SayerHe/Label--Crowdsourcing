# Generated by Django 4.0.3 on 2022-03-21 12:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0005_rename_labeltaskdata_labeltaskfile'),
    ]

    operations = [
        migrations.RenameField(
            model_name='labeltasksbaseinfo',
            old_name='task_type',
            new_name='data_type',
        ),
        migrations.AddField(
            model_name='labeltasksbaseinfo',
            name='task_difficulty',
            field=models.CharField(default='Easy', max_length=50),
            preserve_default=False,
        ),
    ]
