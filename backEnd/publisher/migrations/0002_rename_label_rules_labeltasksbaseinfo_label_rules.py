# Generated by Django 4.0.3 on 2022-03-21 11:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='labeltasksbaseinfo',
            old_name='Label_rules',
            new_name='label_rules',
        ),
    ]
