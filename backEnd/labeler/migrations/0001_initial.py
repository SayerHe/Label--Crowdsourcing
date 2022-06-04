# Generated by Django 4.0.3 on 2022-06-03 13:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('publisher', '0008_labeltasksbaseinfo_publish_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='TempLabel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('labels', models.TextField()),
                ('labeler', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='publisher.labeltasksbaseinfo')),
            ],
        ),
    ]
