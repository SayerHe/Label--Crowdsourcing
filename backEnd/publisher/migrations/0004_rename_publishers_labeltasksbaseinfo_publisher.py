# Generated by Django 4.0.3 on 2022-03-29 14:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0003_rename_publisher_labeltasksbaseinfo_publishers'),
    ]

    operations = [
        migrations.RenameField(
            model_name='labeltasksbaseinfo',
            old_name='publishers',
            new_name='publisher',
        ),
    ]
