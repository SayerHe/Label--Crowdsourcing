# Generated by Django 4.0.3 on 2022-06-04 08:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labeler', '0003_rename_labels_templabel_log_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='templog',
            name='salary',
            field=models.FloatField(default=0),
        ),
    ]
