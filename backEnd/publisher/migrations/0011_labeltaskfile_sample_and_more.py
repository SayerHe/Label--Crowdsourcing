# Generated by Django 4.0.3 on 2022-06-08 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0010_alter_labeltasksbaseinfo_publish_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='labeltaskfile',
            name='sample',
            field=models.TextField(default="{'Index': {}, 'Label': {}}"),
        ),
        migrations.AlterField(
            model_name='labeltasksbaseinfo',
            name='publish_time',
            field=models.DateTimeField(default='2022-06-08'),
        ),
    ]