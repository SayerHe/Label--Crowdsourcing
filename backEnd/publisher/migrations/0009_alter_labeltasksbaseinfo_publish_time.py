# Generated by Django 4.0.3 on 2022-06-04 07:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0008_labeltasksbaseinfo_publish_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labeltasksbaseinfo',
            name='publish_time',
            field=models.DateTimeField(default='2022-06-04'),
        ),
    ]
